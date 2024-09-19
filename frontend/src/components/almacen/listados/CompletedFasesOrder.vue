<template>
  <div>
    <v-text-field
      v-model="search"
      label="Buscar por OF, Fecha entrega o Detalle"
    >
      <template #prepend-inner>
        <v-icon>mdi-magnify</v-icon>
      </template>
    </v-text-field>
    <v-data-table :headers="headers" :items="filteredItems" class="elevation-1">
      <template #[`item.delivery_date`]="{ item }">
        {{ formatDateFromString(item.delivery_date) }}
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCompletedOrdersStore } from '@/stores/completedOrdersStore';
import { formatDateFromString, sortAndNumberArray } from '@/utils/Helpers';

const completedOrdersStore = useCompletedOrdersStore();
const search = ref('');

const headers = [
  { title: 'OF', key: 'order_number', align: 'center', class: 'text-center' },
  { title: 'Fecha entrega', key: 'delivery_date', align: 'center', class: 'text-center' },
  { title: 'Detalle', key: 'detail', align: 'center', class: 'text-center' },
  { title: 'Cantidad', key: 'quantity', align: 'center', class: 'text-center' },
  { title: 'Entregadas', key: 'delivered_quantity', align: 'center', class: 'text-center' },
  { title: 'Orden de cierre', key: 'orderNumber', align: 'center', class: 'text-center' },
];

const filteredItems = computed(() => {
  console.log("completedOrdersStore.getCompletedOrders", completedOrdersStore.getCompletedOrder, completedOrdersStore)
  if (search.value) {
    return sortAndNumberArray(completedOrdersStore.getCompletedOrders().filter(item => (
      item.order_number.toString().includes(search.value) ||
      formatDateFromString(item.delivery_date).includes(search.value) ||
      item.detail.toLowerCase().includes(search.value.toLowerCase())
    )));
  }
  return sortAndNumberArray(completedOrdersStore.getCompletedOrders);
});


onMounted(async () => {
  await completedOrdersStore.fetchCompletedOrders();
});
</script>

<style scoped>
/* Puedes agregar estilos específicos aquí si es necesario */
</style>