
import {PendingStorageService} from '../../../app/Resources/PendingStorage/PendingStorageService';
import {PendingStorageRepository} from '../../../app/Resources/PendingStorage/PendingStorageRepository';
import {PendingStorageModel} from '../../../app/Resources/PendingStorage/PendingStorageModel';
// import {CargaToldoResultDataType} from '../../../app/Resources/PendingStorage/PendingStorageType';

import StationState from '../models/messages/received/StationState';
import GatewayService from '../GatewayService';
import colors from 'cli-color';
import { FindQueryParams } from '@base/Bases/__interfaces/FindQueryParams';
// import { FindResult } from '@base/Bases/__interfaces/FindResult';

import GestionAlmacenService from './GestionAlmacenService';
// import SocketHandler from '@base/Utils/SocketHandler';
import { AlmacenService } from '@src/app/Resources/Almacen/AlmacenService';
import { AlmacenRepository } from '@src/app/Resources/Almacen/AlmacenRepository';
import { AlmacenModel } from '@src/app/Resources/Almacen/AlmacenModel';
import { Order, PendingStorageType } from '@src/app/Resources/PendingStorage/PendingStorageType';
import { CompletedFasesOrderRepository } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderRepository';
import { CompletedFasesOrderModel } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderModel';
import { CompletedFasesOrderService } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderService';
import dotenv from 'dotenv';
import { TransportService } from './TransportService';
import { CompletedFasesOrderType } from '@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderType';
import router from '@base/Files/routes';
import CartState, { CartStateProcess } from '../models/messages/received/CartState';
import { canSendTransit } from '../helpers/Helpers';
dotenv.config();

class StationService {
    
    private pendingStorageService: PendingStorageService;
    private messageService: GatewayService;
    private gestionAlmacenService: GestionAlmacenService;
    private almacenService: AlmacenService;
    private almacenRepository: AlmacenRepository;
    private completedFasesOrderRepository: CompletedFasesOrderRepository;
    private completedFasesOrderService: CompletedFasesOrderService;
    private transportService: TransportService;
    private lastStationState: (StationState|null)[];
    constructor(messageService: GatewayService) {
        this.lastStationState = [null, null];
        this.transportService = new TransportService();
        this.completedFasesOrderRepository = new CompletedFasesOrderRepository(CompletedFasesOrderModel);
        this.completedFasesOrderService = new CompletedFasesOrderService(this.completedFasesOrderRepository);
        this.almacenRepository = new AlmacenRepository(AlmacenModel);
        this.almacenService = new AlmacenService(this.almacenRepository);
        this.messageService = messageService;
        this.gestionAlmacenService = new GestionAlmacenService(messageService);
        const pendingStorageRepository = new PendingStorageRepository(PendingStorageModel);
        this.pendingStorageService = new PendingStorageService(pendingStorageRepository);
    }

    receivedStationState(stationState: StationState){
        // const lugar = stationState.stationType == "1" ? 'Derecha' : 'Izquierda';
        const index = (parseInt(stationState.stationType) == 1) ? 0 : 1;
        this.lastStationState[index] = stationState;
    }

    voidLastStationState(stationType:number):void{
        // qué posisión en el array de lastStationState[0,1]=>lastStationState[I,D]
        const index = (stationType == 1) ? 0 : 1;
        this.lastStationState[index] = null;
    }

    // Comprobar si podemos procesar los mensajes de las estaciones de carga.
    tryProcessLoadOnStation100(cartState: CartState){
        const cartStateProcess = new CartStateProcess(cartState);
        if (cartStateProcess.canProcessMessagesFromStation100()){
            this.processLastStationState();
        }
    }

    isCartReadyForNewMessage(cartState: CartState){
        const cartStateProcess = new CartStateProcess(cartState);
        // console.log("CART STATUS", cartState.cartStatus, cartState);
        return canSendTransit(parseInt(cartState.cartStatus)) && cartStateProcess.isCartReadyForNewMessage();
    }


    processLastStationState(){
        // const lugar = stationState.stationType == "1" ? 'Derecha' : 'Izquierda';
        const stationState: (StationState | null) = (this.lastStationState[0] !== null ) ? this.lastStationState[0] : this.lastStationState[1];

        if (stationState == null){
            return;
        }

        if (stationState.boxReady == '1') {
            this.processPendingStorage(stationState);
        } else {
            this.changePendingStorageStatus(stationState);
        }
    }


    // Comprobar órdenes pendiente de subir a las estaciones de carga
    async processPendingStorage(stationState: StationState){
        const lugar = stationState.stationType == "1" ? 'Izquierda': 'Derecha';
        console.log(colors.yellow(`Hay que descargar la estación 100  ${lugar}, ${stationState.stationType}`));
        if (stationState.boxReady == '1'){
            const query: FindQueryParams = {
                // filters:`{"pending":{"=":true}}`,
                filters:`{"pending":{"=":true},"station_type":{"=":${parseInt(stationState.stationType)}}}`,
                page:"1",
                itemsPerPage:"1",
                sortBy:'["createdAt"]',
                sortDesc:'[false]',
            };
            try {
                const resultsPendingStorage = await this.pendingStorageService.index(query);
                if (resultsPendingStorage.collection.length>0){
                    const pendingStorageRow = resultsPendingStorage.collection[0]; 
                    console.log(`Orden para descargar en la estación ${lugar}`, pendingStorageRow.order);
                    // actualizar el estado de la estación de carga
                    const updateOrderInStationResult = await this.almacenService.updateOrderInStation(parseInt(stationState.stationId), parseInt(stationState.stationType), pendingStorageRow.order, true);
                    if (updateOrderInStationResult){
                        pendingStorageRow.pending = false;
                        const resultsPendingStorage = await this.pendingStorageService.update(pendingStorageRow._id.toString(), pendingStorageRow);
                    }


                    // SOLO ALMACENAMOS, YA NO SE COMPRUEBAN FASES ANTES DE ALMACENAR
                    // // primero comprobar si la orden tiene fases 3 y 4 cerradas buscando en CompletedFasesOrder y la fecha de entrega es <= a hoy entregar
                    // const completedFasesOrder = await this.completedFasesOrderService.getOrder(parseInt(resultsPendingStorage.collection[0].order.number));
                    
                    // console.log("completedFasesOrder",resultsPendingStorage.collection[0].order.number, completedFasesOrder);
                    
                    // // existe, hay que entregar el toldo que está en la estación de carga
                    // if (completedFasesOrder){
                    //     await this.transportService.deliveryFromLoadStation( parseInt(stationState.stationType) );
                    //     return;
                    // }

                    // almacenar la orden que está en la estación de carga
                    this.gestionAlmacenService.sendPendingStorageToAlmacen(parseInt(stationState.stationId), parseInt(stationState.stationType), resultsPendingStorage.collection[0].order);


                }else{
                    console.log(`No tengo cargas pendientes en la estación ${lugar}!!!`);
                }
            } catch (error) {
                console.log(`Error buscando cargas pendientes`, error);
            }
        }
    }
    
    async changePendingStorageStatus(stationState: StationState){
        const lugar = stationState.stationType == "1" ? 'Izquierda': 'Derecha';
        console.log(colors.yellow(`Estación 100  ${lugar} descargada`));
        if (stationState.boxReady == '1'){
            const query: FindQueryParams = {
                filters:`{"pending":{"=":false},"level":{"=":${parseInt(stationState.stationType)}}}`,
                page:"1",
                itemsPerPage:"1",
                sortBy:'["createdAt"]',
                sortDesc:'[false]',
            };
            try {
                const results = await this.pendingStorageService.index(query);
                // console.log(results);
                if (results.collection.length>0){
                    const row: PendingStorageType = results.collection[0];
                    row.pending = false;
                    this.pendingStorageService.update(row._id.toString(), row);
                }else{
                    console.log(`No tengo cargas pendientes en la estación ${lugar}!!!`);
                }
            } catch (error) {
                console.log("Error buscando cargas pendientes");
            }
        }
    }
}

export default StationService;