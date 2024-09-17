import { defineStore } from 'pinia';
import CompletedFasesOrderService from '@/services/CompletedFasesOrderService';

export const useCompletedOrdersStore = defineStore('completedOrders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchCompletedOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await CompletedFasesOrderService.getCompletedFasesOrders();
        console.log("response", response)
        this.orders = response;
      } catch (err) {
        console.error('Error fetching completed orders:', err);
        this.error = 'Failed to fetch completed orders';
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getCompletedOrders: (state) => state.orders,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});