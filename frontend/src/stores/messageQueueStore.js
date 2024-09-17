import { defineStore } from 'pinia';
import MessageQueueService from '@/services/MessageQueueService';

export const useMessageQueueStore = defineStore('messageQueue', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchMessages() {
      this.loading = true;
      this.error = null;
      try {
        const response = await MessageQueueService.getMessages();
        this.messages = response;
      } catch (err) {
        console.error('Error fetching messages:', err);
        this.error = 'Failed to fetch messages';
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getMessages: (state) => state.messages,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});
