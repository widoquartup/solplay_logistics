<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <!-- <v-card>
            <v-card-text> -->
              <v-alert v-if="showWarning" type="warning" class="mb-4">
                No se pudo cargar el contenido del iframe. Esto puede deberse a restricciones de seguridad del navegador. 
                Intente acceder directamente a la URL: <a :href="props.iframeUrl" target="_blank">{{ props.iframeUrl }}</a>
              </v-alert>
              <iframe
                :src="props.iframeUrl"
                width="100%"
                height="800"
                :height="props.height"
                frameborder="0"
                allowfullscreen
                sandbox="allow-scripts allow-same-origin allow-forms"
                @load="onIframeLoad"
                @error="onIframeError"
              ></iframe>
            <!-- </v-card-text>
          </v-card> -->
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    iframeUrl: {
      type: String,
      required: true,
      validator: (value) => {
        // Validar que la URL sea una IP de red local
        const localIpRegex = /^(https?:\/\/)?(192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/;
        return localIpRegex.test(value);
      }
    },
    height: {
      type: String,
      default: '500px'
    }
  });
  
  const showWarning = ref(false);
  
  const onIframeLoad = () => {
    console.log('Iframe cargado correctamente');
    showWarning.value = false;
  };
  
  const onIframeError = () => {
    console.error('Error al cargar el iframe');
    showWarning.value = true;
  };
  </script>