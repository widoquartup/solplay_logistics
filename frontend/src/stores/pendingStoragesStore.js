import { defineStore } from 'pinia';
import PendingStorageService from '@/services/PendingStorageService';

export const usePendingStoragesStore = defineStore('pendingStorages', {
  state: () => ({
    storages: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchPendingStorages() {
      this.loading = true;
      this.error = null;
      try {
        const response = await PendingStorageService.getPendingStorage();
        this.storages = response;
      } catch (err) {
        console.error('Error fetching pending storages:', err);
        this.error = 'Failed to fetch pending storages';
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getPendingStorages: (state) => state.storages,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});
