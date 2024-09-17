import { defineStore } from 'pinia';
import AlmacenService from '@/services/AlmacenService';

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    isConnected: false,
    loading: false,
    error: null,
  }),
  
  actions: {
    async toggleConnection() {
      this.loading = true;
      this.error = null;
      try {
        const command = this.isConnected ? 'disconnect' : 'connect';
        const response = await AlmacenService.toggleConnection(command);
        console.log("toggleConnection",response);
        this.isConnected = command === 'connect';
      } catch (err) {
        console.error('Error toggling connection:', err);
        this.error = 'Failed to toggle connection';
      } finally {
        this.loading = false;
      }
    },
    setStatusConnected(status){
      this.isConnected = status;
    }
  },

  getters: {
    getConnectionStatus: (state) => state.isConnected,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});