<template>
    <div class="transport-info">
    <!-- {{ transportInfo }} -->
    <v-btn class="ml-1" @click="$emit('simulateCarga','3:0')">Cargar D</v-btn>
    <v-btn class="ml-1" @click="$emit('simulateCarga','1:0')">Cargar I</v-btn>
    <v-btn class="ml-1" @click="$emit('cancelTransit')">Cancelar tránsito</v-btn>
    <v-btn class="ml-1" @click="$emit('resetApiGateway')" color="warning">Reset API-Gateway</v-btn>
  </div>
</template>