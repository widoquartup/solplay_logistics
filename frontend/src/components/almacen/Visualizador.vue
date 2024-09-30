<template>
  <div class="pa-5 mt-10">
    <v-row>
      <v-col cols="2">
        <v-list>
          <v-list-item v-for="(item, i) in menuItems" :key="i" :value="item" active-color="primary"
            @click="selectedMenuItem = item.title">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="9">
        <OrdersInStorage v-if="selectedMenuItem === 'OFs en almacén'" @handleDelivery="handleDelivery" />
        <CompletedFasesOrder v-if="selectedMenuItem === 'OFs COA/COH cerradas'"/>
        <PendingStorageList v-if="selectedMenuItem === 'Pendientes de almacenar'" />
        <MessageQueue v-if="selectedMenuItem === 'Cola de mensajes'" />
        <Gateway v-if="selectedMenuItem === 'Singular'" :iframeUrl="VITE_SINGULAR_GATEWAY_URL" />
        <Advanced v-if="selectedMenuItem === 'Controles adicionales'" 
          @simulateCarga="simulateCarga"
          @cancelTransit="$emit('cancelTransit')" 
          @resetApiGateway="$emit('resetApiGateway')" 
          :isTransport="isTransport"
          @changeTransportFunction="$emit('changeTransportFunction')" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref,  defineEmits } from 'vue'
import Gateway from './Gateway.vue'
import Advanced from './Advanced.vue'
import OrdersInStorage from './listados/OrdersInStorage.vue'
import PendingStorageList from './listados/PendingStorageList.vue'
import CompletedFasesOrder from './listados/CompletedFasesOrder.vue'
import MessageQueue from './listados/MessageQueue.vue'

const VITE_SINGULAR_GATEWAY_URL = import.meta.env.VITE_SINGULAR_GATEWAY_URL || '192.168.0.33';
console.log("VITE_SINGULAR_GATEWAY_URL",VITE_SINGULAR_GATEWAY_URL)

const menuItems = [
  { title: 'OFs en almacén' },
  { title: 'Pendientes de almacenar' },
  { title: 'OFs COA/COH cerradas' },
  { title: 'Cola de mensajes' },
  { title: 'Singular' },
  { title: 'Controles adicionales' },
];

const selectedMenuItem = ref('OFs en almacén');

const emit = defineEmits(['simulateCarga', 'handleDelivery','changeTransportFunction'])

const props = defineProps({
  isTransport: {
    type: Boolean,
    required: true
  }
});

function simulateCarga(position){
  emit("simulateCarga",position);

}

function handleDelivery(data){
  emit("handleDelivery",data);

}

</script>
<style scoped></style>