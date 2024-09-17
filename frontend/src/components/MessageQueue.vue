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
      <!-- Puedes personalizar las celdas aquí si es necesario -->
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMessageQueueStore } from '@/stores/messageQueueStore';

const messageQueueStore = useMessageQueueStore();
const search = ref('');

const headers = [
  // Define tus encabezados aquí basándote en la estructura de tus datos
  // Ejemplo:
  // { title: 'ID', key: 'id', align: 'center', class: 'text-center' },
  // { title: 'Mensaje', key: 'message', align: 'center', class: 'text-center' },
  // { title: 'Fecha', key: 'date', align: 'center', class: 'text-center' },
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
/* Puedes agregar estilos específicos aquí si es necesario */
</style>
