import BaseService from "./BaseService";
import { stationTypeToNumber } from "../utils/Helpers";


const getStationData = (data) =>{
  if (data.station =='entrega'){
    return { stationId: 102, stationType: 2, level: 0 }; 
  }
  
  if (data.station === 'carga') {
    return {
        stationId: 100,
        stationType: data.position,
        level: 3
    };
  }
  const result = {stationId : parseInt(data.station)};

  if (data.position) {
    const [side, level] = data.position.split(':');
    result.stationType = parseInt(side);
    result.level = parseInt(level);
  }
  return result;
}


class TransportService extends BaseService {
  
  async registerTransport(from, to) {
    try {
      const data = { from: getStationData(from), to: getStationData(to) };
      const response = await this.doPost(`/almacen/transport`, data );
      return response.data;
    } catch (error) {
      console.error('Error registering transport:', error);
      throw error;
    }
  }
  async unload( to) {
    try {
      const data = { to: getStationData(to) };
      const response = await this.doPost(`/almacen/unload`, data );
      return response.data;
    } catch (error) {
      console.error('Error registering transport:', error);
      throw error;
    }
  }
  async cancelTransit() {
    // console.log("Service cancelTransit");
    try {
      const response = await this.doPut(`/almacen/transit/cancel`, null );
      return response.data;
    } catch (error) {
      console.error('Error while cancel transit:', error);
      throw error;
    }
  }
  async addPosition(station) {
    // console.log("Add Position", station);
    try {
      const data = {
        station_id: station.station_id,
        station_type:  stationTypeToNumber(station.station_type),
        level: station.level,
        loaded: false,
        status_ok: station.status_ok,
        isDeleted: false
    }
      const response = await this.doPost(`/almacen`, data );
      return response.data;
    } catch (error) {
      console.error('Error while cancel transit:', error);
      throw error;
    }
  }
  async reset_api_gateway() {
    // console.log("Add Position", station);
    try {
      const response = await this.doGet(`/almacen/reset-gateway` );
      return response.data;
    } catch (error) {
      console.error('Error while reset gateway:', error);
      throw error;
    }
  }
  async getStations() {
    // console.log("Add Position", station);
    try {
      const params = '?sortBy=["station_id","station_type","level"]&sortDesc=[false,false,false]&itemsPerPage=300';
      const response = await this.doGet(`/almacen${params}` );
      return response.data;
    } catch (error) {
      console.error('Error while cancel transit:', error);
      throw error;
    }
  }
  async toggleConnection(command) {
    try {
      const response = await this.doPost(`/almacen/gateway/tcp-status`, {command});
      return response.data;
    } catch (error) {
      console.error('Error toggling connection:', error);
      throw error;
    }
  }
}

export default new TransportService();