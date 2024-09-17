<template>
  <div class="station" :class="isEntrega ? 'entrega':''">
    <div class="station-label scroll-item" :key="stationName" :id="`scroll-item-${stationName}`">{{ stationName }}</div>
    <div class="positions" >
      <template v-if="isEntrega">
        <v-btn
          color="white"
          class="position entrega-btn"
          :class="{ 'entrega-transition': isEntregaTransition }"
          @click="$emit('position-click', stationName, 'E')"
        >
          E
        </v-btn>
      </template>
      <template v-else>
        <!-- {{stationData}} -->
        <v-btn
          :id="`btn-${station.station_id}-${station.station_type}-${station.level}`"
          v-for="station in stationData"
          :key="`${station.station_type}-${station.level}`"
          data-active="false"
          :color="getPositionColor(station)"
          :disabled="!station.status_ok"
          class=" position btn-station transition-button "
          :class="getClass(station)"
          @click="$emit('position-click', stationName, `${station.station_type}:${station.level}`)"
          @contextmenu.prevent="$emit('position-context', stationName, `${station.station_type}:${station.level}`, station.order)"
        >
          <span v-if="station.station_id !== 100" class="preferent_order">{{station.preferent_order}}</span>
          &nbsp;<span class="type_level">{{station.station_type == 3 ? "D" : "I"}} {{station.level!==0 ? station.level :'' }}</span>
          <v-icon
            v-if="station.order"
            :color="'rgba(255, 255, 255, 0.7)'"
            size="small"
            class="order-icon"
            :icon="station.loaded ? 'mdi-circle-slice-8' : 'mdi-circle-outline'"
            >
          </v-icon>
        </v-btn>
    </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  stationData: Object,
  stationName: String,
  isEntrega: {
    type: Boolean,
    default: false
  },
  isEntregaTransition: {
    type: Boolean,
    default: false
  }
})


defineEmits(['position-click', 'position-context'])

function getPositionColor(station) {
  if (!station.status_ok) return 'grey'
  if (station.station_id==100){
    return station.loaded ? 'red' :'#ff000098';
  }
  return station.loaded ? 'orange' : 'green'
}

function getClass(station){
  const margin = (station.level == 1 || station.level == 3) && station.station_type==3 ? " mb-5 ": "";
  return  margin
}

</script>

<style scoped>

.station100{
  background-color: red !important;
}

.station {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: 0px;
  background-color: white;
  border-radius: 5px;
}


.station-label {
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
}

.status-indicators {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
}

.status-indicator {
  font-size: 8px;
  padding: 2px 4px;
  border: 1px solid #ccc;
  margin: 2px 0;
  background-color: #eee;
}

.status-indicator.active {
  background-color: #4caf50;
  color: white;
}



.positions.carga{
  margin-top: -10px;
}

.positions {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 220px;
  justify-content: center;
}

.position {
  width: 100px;
  height: 50px;
  margin: 4px 0;
  font-size: 18px;
  position: relative;
}

.entrega-btn {
  position: relative;
  overflow: hidden;
  background-color: #1867c0 !important;
  color: white !important;
}

.entrega-btn::before {
  content: '';
  position: absolute;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, orange 100%, white 100%);
  transition: left 0.35s ease-out;
}
.station.entrega{
  margin-top:6px !important;
  ;
}

.entrega-btn span {
  position: relative;
  z-index: 1;
}



.preferent_order {
  position: absolute;
  top: 2px;
  left: 2px;
  color: rgba(0, 0, 0, 0.19);
  font-weight: bold;
  font-size: 14px;
}

.type_level {
  position: absolute;
  bottom: 2px;
  right: 2px;
  color: white;
  font-weight: bold;
  font-size: 10px;
}

.order-icon {
  position: absolute;
  bottom: 2px;
  left: 2px;
}

.btns-Carga{
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 220px;
  justify-content: center;
}

.fixed-station .positions {
  margin-top: -4px !important;
}
.fixed-station.station100 .positions{
  margin-top: -5px !important;
}

</style>