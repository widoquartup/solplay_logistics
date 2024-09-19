// AlmacenService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { AlmacenRepository } from './AlmacenRepository';
import { AlmacenType } from './AlmacenType';
import { TransportParameterType, ResponseTransportType } from './AlmacenTypes';
import { TransportService } from '@src/services/SolplayMessages/services/TransportService';
import { Order } from '../PendingStorage/PendingStorageType';


export class AlmacenService extends ServiceBase<AlmacenType> {
  protected transportService: TransportService;

  constructor(repository: AlmacenRepository) {
    super(repository);
    this.transportService = new TransportService();
    // this.changeOrderInStorage = this.changeOrderInStorage.bind(this);
  }

  async storeAndSendWebSocketMessage(item: AlmacenType): Promise<unknown> {
    return await this.repository.create(item);
  }

  // transporta de una estación a otra
  async transport(from: TransportParameterType, to: TransportParameterType): Promise<ResponseTransportType>{
    return this.transportService.transport(from, to);
  }
  
  
  // Mover en la bbdd
  async changeOrderInStorage(from: TransportParameterType, to: TransportParameterType): Promise<{data:string}>{
    // console.log("MOVE ORDER FROM TO ", from, to); 
    const fromAlmacen :AlmacenType[] = await this.repository.findWithMongo({ station_id: from.stationId, station_type: from.stationType, level:from.level });
    // console.log(" fromAlmacen", fromAlmacen[0]);
    if (fromAlmacen.length<1){
      return { data: "Sin estación from" };
    }
    if (!fromAlmacen[0].order){
      return { data: "Sin órden" };
    }
    const toAlmacen :AlmacenType[] = await this.repository.findWithMongo({ station_id: to.stationId, station_type: to.stationType, level:to.level });
    // console.log(" toAlmacen", toAlmacen[0]);
    if (toAlmacen.length<1){
      return { data: "Sin estación to" };
    }
    const toAlmacenUpdate = { order: fromAlmacen[0].order, loaded: true};
    const fromAlmacenUpdate = { order: null, loaded: false};
    toAlmacen[0].order = fromAlmacen[0].order;
    toAlmacen[0].loaded = true;
    fromAlmacen[0].order = null;
    fromAlmacen[0].loaded = false;
    // TODO: HAY QUE CAMBIARLO POR EL update, esto es un apaño porque hay un error en el update y no he podido solucionar hasta ahora
    await (this.repository as AlmacenRepository).updateStation(toAlmacen[0], toAlmacenUpdate);
    await (this.repository as AlmacenRepository).updateStation(fromAlmacen[0], fromAlmacenUpdate);
    return { data: "Ok" }; 
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
    
    // station.loaded = loaded;
    // station.order = order;

    // TODO: HAY QUE CAMBIARLO POR EL update, esto es un apaño porque hay un error en el update y no he podido solucionar hasta ahora
    const updatedStation = await (this.repository as AlmacenRepository).updateStation(station, {loaded, order} );
    if (!(updatedStation && updatedStation._id == station._id)){
      false;
    }
    return true;
  }

  // Actualizar una estación
  // TODO: HAY QUE CAMBIARLO POR EL update, esto es un apaño porque hay un error en el update y no he podido solucionar hasta ahora
  async updateStation(station: AlmacenType, data: Partial<AlmacenType>):Promise<AlmacenType>{
    const updatedStation = await (this.repository as AlmacenRepository).updateStation(station, data );
    return updatedStation;
  }
}
