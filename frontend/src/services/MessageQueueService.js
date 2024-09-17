import BaseService from './BaseService';

class MessageQueueService extends BaseService {
  async getMessages() {
    try {
      const response = await this.doPost('message-queue/pending', {}, {
        headers: await this.getHeaders()
      });
      if (response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error getting messages from queue:', error);
      throw error;
    }
  }
}

export default new MessageQueueService();
