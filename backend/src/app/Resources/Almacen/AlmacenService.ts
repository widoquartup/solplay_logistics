// AlmacenService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { AlmacenRepository } from './AlmacenRepository';
import { AlmacenType } from './AlmacenType';
import { context } from '@base/context';
import { getLoad, getUnload, sleep } from '@src/services/SolplayMessages/helpers/Helpers';
import { TransportParameterType, ResponseTransportType } from './AlmacenTypes';
import CancelTransit from '@src/services/SolplayMessages/models/messages/send/CancelTransit';
import { TransportService } from '@src/services/SolplayMessages/services/TransportService';
import SocketHandler from '@base/Utils/SocketHandler';
import { Order } from '../PendingStorage/PendingStorageType';
const SOCKET_EVENT_STORE_CHANGED = process.env.SOCKET_EVENT_STORE_CHANGED || 'storeChanged';

// import type { FindQueryParams } from "@base/Bases/__interfaces/FindQueryParams";
// import type { FindResult } from "@base/Bases//__interfaces/FindResult";

export class AlmacenService extends ServiceBase<AlmacenType> {
  protected transportService: TransportService;

  constructor(repository: AlmacenRepository) {
    super(repository);
    this.transportService = new TransportService();
  }

  async storeAndSendWebSocketMessage(item: AlmacenType): Promise<unknown> {
    return await this.repository.create(item);
  }

  // transporta de una estación a otra
  async transport(from: TransportParameterType, to: TransportParameterType): Promise<ResponseTransportType>{
    return this.transportService.transport(from, to);
  }
  
  // en caso de error en el carro si está cargado podemos hacer el unload a la estación indicada
  async unload(to: TransportParameterType): Promise<ResponseTransportType>{
    return this.transportService.unload(to);
  }

  // enviamos mensaje para cancelar el tránsito activo
  async cancelTransit(){
    return this.transportService.cancelTransit();
  }
  
  resetGateway(){
    return this.transportService.resetGateway();
  }


  // actualizar el estado de carga de una estación 
  async updateOrderInStation(station_id: number, station_type: number, order: Order, loaded: boolean): Promise<boolean>{
    const query = {
      "$and": [
        {station_id: station_id },
        {station_type: station_type }
      ]
    };
    //Buscamos la estación
    const station = await this.repository.findOne(query);
    if (!station){
      return false;
    }
    // añado la orden a la estación
    station.loaded = loaded;
    station.order = order;
    const updatedStation = await this.repository.update(station._id, station );
    if (!(updatedStation && updatedStation._id == station._id)){
      false;
    }
   

    return true;

  }
}
