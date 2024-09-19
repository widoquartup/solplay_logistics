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
      <template #[`item.order.fecha_entrega`]="{ item }">
        {{ formatDateFromString(item.order.fecha_entrega) }}
      </template>
      <template #[`item.station_type`]="{ item }">
        {{ (item.station_type == 1 ? "Izquierda" : "Derecha") }}
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePendingStoragesStore } from '@/stores/pendingStoragesStore';
import { formatDateFromString, sortAndNumberArray } from '@/utils/Helpers';
const pendingStoragesStore = usePendingStoragesStore();
const search = ref('');

const headers = [
  { title: 'Orden de entrega', key: 'orderNumber', align: 'center', class: 'text-center' },
  { title: 'Estación carga', key: 'station_type', align: 'center', class: 'text-center' },
  { title: 'OF', key: 'order.number', align: 'center', class: 'text-center' },
  { title: 'Fecha entrega', key: 'order.fecha_entrega', align: 'center', class: 'text-center' },
  { title: 'Detalle', key: 'order.detalle', align: 'center', class: 'text-center' },
  { title: 'Nro bulto', key: 'order.bulto', align: 'center', class: 'text-center' },
  { title: 'Bultos total', key: 'order.cantidad', align: 'center', class: 'text-center' },
];

const filteredItems = computed(() => {
  if (search.value) {
    return sortAndNumberArray(pendingStoragesStore.storages.filter(item => (
      item.order_number.toString().includes(search.value) ||
      formatDateFromString(item.delivery_date).includes(search.value) ||
      item.detail.toLowerCase().includes(search.value.toLowerCase())
    )));
  }
  return sortAndNumberArray(pendingStoragesStore.storages);
});


onMounted(async () => {
  await pendingStoragesStore.fetchPendingStorages();
});
</script>

<style scoped>
</style>
