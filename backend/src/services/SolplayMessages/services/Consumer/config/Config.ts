
// Importa otros modelos y repositorios según sea necesario

import { CompletedFasesOrderModel } from "@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderModel";
import { CompletedFasesOrderRepository } from "@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderRepository";
import { context } from '@base/context';
// import GestionAlmacenService from "../../GestionAlmacenService";
import { CompletedFasesOrderType } from "@src/app/Resources/CompletedFasesOrder/CompletedFasesOrderType";
import {AlmacenRepository} from '@src/app/Resources/Almacen/AlmacenRepository';
import {AlmacenModel} from '@src/app/Resources/Almacen/AlmacenModel';
import { TransportParameterType } from "@src/app/Resources/Almacen/AlmacenTypes";
import { TransportService } from "../../TransportService";


class CompletedFasesOrder{

  private almacenRepository: AlmacenRepository;

  constructor() {
    this.almacenRepository = new AlmacenRepository(AlmacenModel);
  }

  async ifExistOrderDeliverIt (record: CompletedFasesOrderType): Promise<any>{
    const message = context.message;
    try {
      const stationsWithOrdersResult = await this.almacenRepository.find({filters:`{ "$and": [ {"order.number": {"=":"${record.order_number}"}},{"processing": {"=":false}} ] }`});
      console.log("ifExistOrderDeliverIt",stationsWithOrdersResult);
      if (stationsWithOrdersResult.collection.length>0){
        for( let position of stationsWithOrdersResult.collection ){
          const from: TransportParameterType = {
            stationId: position.station_id,
            stationType: position.station_type,
            level: position.level
          };
          const to: TransportParameterType = {
            stationId: 102,
            stationType: 2,
            level: 0
          };
          const transportService = new TransportService();
          const resultTransport = await transportService.transport(from, to);
          //
          // Hay que ir sumando en el registo "record" delivered_quantity.
          // Ésto lo hacemos luego de recibir un ack, o station ready, buscar en los últimos mensaje y rastrear la estación y orden para modificar.
          //
          if (resultTransport){
            position.processing = true;
            const resultPosition = await this.almacenRepository.updateStation(position, {processing: true});
            console.log("Result update psition ", resultPosition);
          }
          console.log("Result transport ", from, to, resultTransport);
        }
      }
      return stationsWithOrdersResult;
    } catch (error) {
      console.log("Error consultando el almacén", error);
    }
    return false;      
  }

  async consumerCompletedFasesOrderModel (record: CompletedFasesOrderType): Promise<any>{
    return await this.ifExistOrderDeliverIt(record);
  }

}


const completedFasesOrder = new CompletedFasesOrder();

export const dataConsumerConfig = {
  services: [
    {
      model: CompletedFasesOrderModel,
      repository: new CompletedFasesOrderRepository(CompletedFasesOrderModel),
      consumerObject: completedFasesOrder,
      intervalMs: 10000
    },
    // Añade más servicios según sea necesario
  ]
};
