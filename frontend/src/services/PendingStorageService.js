import BaseService from './BaseService';

class PendingStorageService extends BaseService {
  
  async submitCargaToldo(station_type, producto) {
    try {
      const data = { station_type, producto };
      const response = await this.doPost(`pending-storage/carga-toldo`, data, {
        headers: await this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting carga toldo:', error);
      throw error;
    }
  }
  async getPendingStorage() {
    try {
      const response = await this.doGet(`pending-storage?filters={"pending":{"=":true}}`, {
        headers: await this.getHeaders()
      });
      if (response.data && response.data.collection){
        return response.data.collection;
      }
      return [];
    } catch (error) {
      console.error('Error getting pending storage:', error);
      throw error;
    }
  }
}

export default new PendingStorageService();