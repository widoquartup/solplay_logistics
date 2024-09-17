
import {AlmacenService} from '../../../app/Resources/Almacen/AlmacenService';
import {AlmacenRepository} from '../../../app/Resources/Almacen/AlmacenRepository';
import {AlmacenModel} from '../../../app/Resources/Almacen/AlmacenModel';
// import StationState from '../models/messages/received/StationState';
import GatewayService from '../GatewayService';
// import colors from 'cli-color';
// import { FindQueryParams } from '@base/Bases/__interfaces/FindQueryParams';
// import { FindResult } from '@base/Bases/__interfaces/FindResult';
import SocketHandler from '@base/Utils/SocketHandler';
import { Order } from '@src/app/Resources/PendingStorage/PendingStorageType';
// import { SortValues } from 'mongoose';
import { SortType } from '@base/Bases/RepositoryInterface';
import { TransportParameterType } from '@src/app/Resources/Almacen/AlmacenTypes';
import { AlmacenType } from '@src/app/Resources/Almacen/AlmacenType';
import dotenv from 'dotenv';
import { CompletedFasesOrderService } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderService';
import { CompletedFasesOrderRepository } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderRepository';
import { CompletedFasesOrderModel } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderModel';
import { CompletedFasesOrderType } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderType';
import { calculateOrderReadyDate, convertQuartupDateToDate, isReadyToDelivery } from '../helpers/Helpers';
import { KafkaMessage } from '@src/services/Kafka/KafkaConsumer';
dotenv.config();
const SOCKET_EVENT_STORE_CHANGED = process.env.SOCKET_EVENT_STORE_CHANGED || 'storeChanged';
const SOCKET_CONNECTION_STATUS = process.env.SOCKET_CONNECTION_STATUS || 'connection_status';
class GestionAlmacenService {
    
    private almacenService: AlmacenService;
    private messageService: GatewayService;
    private almacenRepository: AlmacenRepository;
    private completedFasesOrderRepository: CompletedFasesOrderRepository;
    private completedFasesOrderService: CompletedFasesOrderService;
    constructor(messageService: GatewayService) {
        this.messageService = messageService;
        this.almacenRepository = new AlmacenRepository(AlmacenModel);
        this.almacenService = new AlmacenService(this.almacenRepository);
        this.completedFasesOrderRepository = new CompletedFasesOrderRepository(CompletedFasesOrderModel);
        this.completedFasesOrderService = new CompletedFasesOrderService(this.completedFasesOrderRepository);
    }

    async sendConnectionStatus (data: object|null) {
        this.sendMessageToGatewayApp(data, SOCKET_CONNECTION_STATUS);
    }
    async sendUpdateStorageMessageToGatewayApp (data: object|null) {
        this.sendMessageToGatewayApp(data, SOCKET_EVENT_STORE_CHANGED);
    }
    // enviar mensaje por websocket a la app almacén y guardar la orden en 
    async sendMessageToGatewayApp (data: object|null, messageType: string = SOCKET_EVENT_STORE_CHANGED) {
        // console.log(data);
        SocketHandler.emitMessage(messageType, JSON.stringify(data));
    }

    // gestiona el envío de una carga a la estación para almacenar.
    // buscar si existe alguna estación que tenga ese número de orden y bulto.
    // comprobar que esté descargada sino devolver un error?
    // si no existe comprobar los espacios necesarios de la orden y reservar los espacios en las estaciones ordenadas por preferent_order.
    async sendPendingStorageToAlmacen (stationId: number, stationType: number, order: Order): Promise<unknown > {

        const query = { "order.number": order.number.toString(), "order.bulto": order.bulto, "station_id": { "$lt": 100 } };
        // const sort = { "preferent_order": 1} as SortType;
        const almacenResult = await this.almacenService.findWithMongo(query);
        console.log("sendPendingStorageToAlmacen almacenResult", almacenResult, query);
        if (almacenResult.length > 0 && almacenResult[0].loaded){
            // Error o debería enviar a la primera descargada sin reservar?
            // throw Error(`La posición ya está ocupada con esa orden y bulto`);
            console.log(`La posición ya está ocupada con esa orden y bulto`);
        }
        // Encontró posición reservada para la orden y está descargada
        if (almacenResult.length > 0){
            return this.processSendToAlmacen({stationId, stationType, level: 3}, almacenResult[0]);
        }

        // No hay posiciones reservados
        // Reservar las posiciones necesarias para la cantidad indicada en la orden
        const nroDeBulto = order.bulto;
        const positionsReserved = await this.reservePositions(order);
        if (positionsReserved && positionsReserved.length>=nroDeBulto){
            
            return this.processSendToAlmacen({stationId, stationType, level: 3}, positionsReserved[nroDeBulto-1]);
        }
        return null;
        // console.log(data);
    }
    
    async processSendToAlmacen(from: TransportParameterType, station: AlmacenType): Promise<unknown>{
        const to = {
            stationId: station.station_id, 
            stationType: station.station_type, 
            level: station.level
        };
        return await this.almacenService.transport(from, to);
    }

    // reserva las posiciones en el almacén
    async reservePositions(order:Order): Promise<AlmacenType[]>{
        // Habría que comprobar la fecha de entrega y decidir a partir de qué posición reservamos.
        // console.log(order);
        const query = {
            "$and": [
              {
                "$or": [
                  { "order": { "$exists": false } },
                  { "order": null }
                ]
              },
              { "status_ok": true },
              { "station_id": {"$ne": 100} },
              { "loaded": false }
            ]
        };
        const sort = {"preferent_order": 1} as SortType;
        const almacenResult = await this.almacenService.findWithMongo(query, sort);
        if (almacenResult && almacenResult.length < 1){
            // Error porque no hay posiciones libres!!!
            throw Error("No hay espacio en el almacén!");
        }
        let bulto: number = 0;
        const positionsReserved: AlmacenType[] = [];
        // Que pasa si no hay tantas posiciones libres??
        const cantidadBultos = order.cantidad;
        for ( bulto= 1; bulto <= cantidadBultos; bulto++){
            // No hay más espacios
            if (almacenResult.length < bulto){
                break;
            }
            almacenResult[bulto-1].order = order;
            almacenResult[bulto-1].order!.bulto = bulto;
            const updateResult = await this.almacenService.update(almacenResult[bulto-1]._id, almacenResult[bulto-1]);
            if (!updateResult){
                throw Error(`Error al guardar la posición ${almacenResult[bulto-1].station_id} / ${almacenResult[bulto-1].station_type} / ${almacenResult[bulto-1].level}` );
            }
            positionsReserved.push(almacenResult[bulto-1]);
        }
        if ( bulto <= order.cantidad){
            // No hay espacios suficientes
        }
        return positionsReserved;
    }

    // Recibe un mensaje desde Kafka de una orden completada
    async receivedClosedFaseOrder(messageData: KafkaMessage){
        const filters = {"order_number": messageData.of};
        try {
          const result = await this.completedFasesOrderService.findWithMongo(filters);
          // Si no existe lo añado
          if (result.length==0){
            const result = await this.completedFasesOrderService.store({
              order_number: parseInt(messageData.of),
              status: messageData.estado,
              delivered: false,
              delivery_date: convertQuartupDateToDate(messageData.fecha_fin),
              quantity: parseInt(messageData.cantidad),
              detail: messageData.nombre,
              delivered_quantity: 0,
              isDeleted: false
            } as CompletedFasesOrderType);
            if (result){
              this.sendMessageToGatewayApp(result, SOCKET_EVENT_STORE_CHANGED);
              
            }
            console.log("Registro creado ", result);
          }
        } catch (error) {
          console.log('Error creando el registro:', error);
          
        }  
    }


    async incrementDeliveredQuantityInCompletedFasesOrder(order:Order):Promise<boolean> {
        const completedFasesOrder:CompletedFasesOrderType[] = await this.completedFasesOrderService.findWithMongo({order_number: parseInt(order.number)});
        if (completedFasesOrder.length > 0){
            const row = completedFasesOrder[0];
            row.delivered_quantity++;
            row.delivered = row.quantity <= row.delivered_quantity;
            return (await this.completedFasesOrderService.update(row._id, row) ? true : false);
        }
        return false;
    }

    async processDeliveryReady(): Promise<void>{
        // órdenes con fases cerradas y pendientes de entrega
        const completedFasesOrders:CompletedFasesOrderType[] = await this.completedFasesOrderService.findWithMongo({delivered: false});
        if (completedFasesOrders.length==0){
            return;
        }
        const query = {
            "$and": [
              {
                "$or": [
                  { "order": {"$ne":null }},
                  { "order": {"$ne":undefined }},
                ]
              },
              { "status_ok": true },
              { "station_id": {"$ne": 100} },
              { "loaded": true }
            ]
        };
        // posiciones con órdenes asignadas y con carga
        const loadedAlmacenResult: AlmacenType[] = await this.almacenService.findWithMongo(query);
        if (loadedAlmacenResult.length==0){
            return;
        }
        // fecha a partir de la cual se puede entregar
        const earliestDeliveryDate = calculateOrderReadyDate();
        // array con el número de ordenes que ya se pueden entregar
        const ordersReadyForDelivery: number[] = completedFasesOrders.filter( (order: CompletedFasesOrderType) => (earliestDeliveryDate >= order.delivery_date) ).map(row => row.order_number);
        // array con las posiciones (station) para entregar.
        const positionsWithOrdersReadyForDelivery: AlmacenType[] = loadedAlmacenResult.filter( (station: AlmacenType) => (-1 < ordersReadyForDelivery.findIndex( (order: number) => (station.order !== null ? parseInt(station.order.number) === order : false) )));
        
        for( const station of positionsWithOrdersReadyForDelivery ){
            console.log("Delivering:", station);
            const from = {
                stationId: station.station_id, 
                stationType: station.station_type, 
                level: station.level
            };
            const to = {stationId: 102, stationType: 2,level: 0};
            // entregar desde la estación indicada 
            await this.almacenService.transport(from, to);
        }
    }

}

export default GestionAlmacenService;