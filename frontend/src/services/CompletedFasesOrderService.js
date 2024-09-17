import BaseService from './BaseService';

class CompletedFasesOrderService extends BaseService {
  async getCompletedFasesOrders() {
    try {
      // const response = await this.doGet(`completed-fases-orders?filters={"delivered_quantity":{"<=":"$quantity"}}`, {
      const response = await this.doGet(`completed-fases-orders/completed/not-delivered`, {
        headers: await this.getHeaders()
      });
      if (response.data ) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error getting completed fases orders:', error);
      throw error;
    }
  }
}

export default new CompletedFasesOrderService();