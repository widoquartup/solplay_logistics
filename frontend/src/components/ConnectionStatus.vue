<template>
  <v-btn
    :color="connectionStore.isConnected ? 'green' : 'red'"
    :loading="connectionStore.isLoading"
    @click="connectionStore.toggleConnection"
  >
    {{ connectionStore.isConnected ? 'Conectado al gateway' : 'Desconectado del gateway' }}
  </v-btn>
</template>

<script>
import { defineComponent } from 'vue';
import { useConnectionStore } from '@/stores/connectionStore';

export default defineComponent({
  name: 'ConnectionStatus',
  setup() {
    const connectionStore = useConnectionStore();
    return { connectionStore };
  },
});
</script>

<style scoped>
.v-btn { text-transform: none; }
</style>