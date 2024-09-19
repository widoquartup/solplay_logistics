<template>
  <div>
    
    <v-text-field
      v-model="search"
      label="Buscar en la cola de mensajes"
    >
      <template #prepend-inner>
        <v-icon>mdi-magnify</v-icon>
      </template>
    </v-text-field>
    <v-data-table :headers="headers" :items="filteredItems" class="elevation-1">
      <template #[`item.order.createdAt`]="{ item }">
        <!-- {{ item.order.createdAt. }} -->
        <!-- {{ formatDate(item.order.createdAt.) }} -->
      </template>
      <template #[`item.from`]="{ item }">
        <v-chip class="station-chip">{{ item.from.station_id }}</v-chip><v-chip>{{ getStationTypeString(item.from.station_type) }}</v-chip><v-chip>{{ getStationLevelString(item.from.level) }}</v-chip>
      </template>    
      <template #[`item.to`]="{ item }">
        <v-chip>{{ item.to.station_id }}</v-chip><v-chip>{{ getStationTypeString(item.to.station_type) }}</v-chip><v-chip>{{ getStationLevelString(item.to.level) }}</v-chip>
      </template>    
      <template #[`item.fromPending`]="{ item }">
        <v-chip 
          :color="item.fromPending ? 'red' : 'green'"
          :text-color="item.fromPending ? 'white' : 'black'"
        >
          {{ item.fromPending ? 'pendiente' : 'finalizado' }}
        </v-chip>
      </template>    
      <template #[`item.toPending`]="{ item }">
        <v-chip
          :color="item.toPending ? 'red' : 'green'"
          :text-color="item.toPending ? 'white' : 'black'"
        >
          {{ item.toPending ? 'pendiente' : 'finalizado' }}
        </v-chip>
      </template>    
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMessageQueueStore } from '@/stores/messageQueueStore';
import { formatDate, getStationLevelString, getStationTypeString } from '@/utils/Helpers';

const messageQueueStore = useMessageQueueStore();
const search = ref('');

const headers = [
  // Define tus encabezados aquí basándote en la estructura de tus datos
  // Ejemplo:
  { title: 'Fecha', key: 'createdAt', align: 'center', class: 'text-center' },
  { title: 'Desde estación', key: 'from', align: 'center', class: 'text-center' },
  { title: 'Status', key: 'fromPending', align: 'center', class: 'text-center' },
  { title: 'Hasta estación', key: 'to', align: 'center', class: 'text-center' },
  { title: 'Status', key: 'toPending', align: 'center', class: 'text-center' },
];

const filteredItems = computed(() => {
  if (search.value) {
    return messageQueueStore.getMessages.filter(item =>
        Object.values(item).some(val =>
        val.toString().toLowerCase().includes(search.value.toLowerCase())
      )
    );
  }
  return messageQueueStore.getMessages;
});

onMounted(async () => {
  await messageQueueStore.fetchMessages();
});
</script>

<style scoped>
.station-chip{
  font-weight: bold;
  margin-right: 2px
}
</style>
