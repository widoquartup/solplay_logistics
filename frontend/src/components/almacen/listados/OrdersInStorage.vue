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
      <template #[`item.preferent_order`]="{ item }">
        {{ item.preferent_order ? item.preferent_order : 0 }}
      </template>
      <template #[`item.order.fecha_entrega`]="{ item }">
        {{ formatDateFromString(item.order.fecha_entrega) }}
      </template>
      <template #[`item.station_id`]="{ item }">
        <v-chip @click="scrollToItem(item)" class="station-btn" :class="{ loaded: item.loaded }">
          {{ formatStationId(item.station_id) }}
        </v-chip>
      </template>
      <template #[`item.station_type`]="{ item }">
          {{ (item.station_type==3 ? "Der" : "Izq") }}
      </template>
      <template #[`item.level`]="{ item }">
          {{ (item.level==2 ? "Int" : "Ext") }}
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn v-if="item.loaded" size="small" @click="entregar(item)" color="primary">
          Entregar
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
import { LEVEL_ORDER_POSITIONS, useStationStore } from '@/stores/stationsStore' // Importamos el store
import moment from 'moment'
import { formatDateFromString, formatStationId } from '@/utils/Helpers';
const stationStore = useStationStore();

const emit = defineEmits(['handleDelivery']);

const search = ref('');

const headers = [
  { title: 'OF', key: 'order.number', align: 'center', class: 'text-center' },
  { title: 'Fecha entrega', key: 'order.fecha_entrega', align: 'center', class: 'text-center' },
  { title: 'Detalle', key: 'order.detalle', align: 'center', class: 'text-center' },
  { title: 'Nro bulto', key: 'order.bulto', align: 'center', class: 'text-center' },
  { title: 'Bultos total', key: 'order.cantidad', align: 'center', class: 'text-center' },
  { title: 'Preferencia', key: 'preferent_order', align: 'center', class: 'text-center' },
  { title: 'Estación', key: 'station_id', align: 'center', class: 'text-center' },
  { title: 'Der/Izq', key: 'station_type', align: 'center', class: 'text-center' },
  { title: 'Int/ext', key: 'level', align: 'center', class: 'text-center' },
  { title: 'Entregar', key: 'actions', align: 'center', class: 'text-center' },
]

const filteredItems = computed(() => {
  const items = [...stationStore.stations.carga, ...stationStore.stations.almacen].flat().filter(item => (item.order !== undefined && item.order !== null));
  if (search.value) {
    return items.filter(item => (
      item.order.number.toString().includes(search.value) ||
      formatDateFromString(item.order.fecha_entrega).includes(search.value) ||
      item.order.detalle.toLowerCase().includes(search.value.toLowerCase())
    ));
  }
  return items;
});

const scrollToItem = (item) => {
  const { station_id, station_type, level } = item;
  const scrollContainer = document.getElementById('scrollContainer');
  let element = document.getElementById(`scroll-item-${station_id}`);
  if (station_id == 100){
    element = document.getElementById(`scroll-item-Carga`);
  }
  if (element) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    scrollContainer.scrollLeft = elementRect.left - containerRect.left + scrollContainer.scrollLeft - 50;
    const btn = document.getElementById(`btn-${station_id}-${station_type}-${level}`);
    console.log(btn)
    if (btn.dataset.active == "false") {
      btn.dataset.active = btn.dataset.active = "true";
      btn.classList.add("active");
      setTimeout(() => {
        const btn = document.getElementById(`btn-${station_id}-${station_type}-${level}`);
        btn.classList.remove("active");
        btn.dataset.active = btn.dataset.active == "false";
      }, 2000);
    } else {
      btn.dataset.active = "false";
    }
  }
};



function entregar(item) {
  console.log("Entregar item:", item);
  const station = item.station_id == "100" ? "carga" :item.station_id; 
  emit("handleDelivery",{station: station, position: `${item.station_type}:${item.level}`});
}

</script>
<style>

.station-btn{
  background-color: green !important;
  color: white;
  font-weight: bold;
}
.station-btn.loaded{
  background-color: orange !important;
  color: white;
}

.transition-button {
  transition: box-shadow 1s ease, filter 1s ease;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  filter: brightness(100%);
}

.transition-button.active {
  animation: blink 0.5s infinite;
}

/* Definición de la animación de parpadeo */
@keyframes blink {

  0%,
  100% {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    filter: brightness(100%);
  }

  50% {
    height:100px;
    height:50px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    filter: brightness(120%);
  }
}

.station-btn {
  /* width: 50px !important;
  height: 50px !important; */
  /* min-width: 0 !important;
  padding: 0 !important; */
  /* font-size: 12px !important; */
}
</style>