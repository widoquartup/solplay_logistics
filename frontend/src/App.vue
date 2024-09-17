<template>
  <div id="app2" :class="{ login: !isLoggedIn }">
    <LoginComponent v-if="!isLoggedIn" />
    <template v-else>
      <AppHeader />
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import LoginComponent from './components/layout/LoginComponent.vue';
import { useAuthStore } from './stores/authStore';
import AppHeader from '@/components/layout/AppHeader.vue'

const authStore = useAuthStore();

const isLoggedIn = computed(() => {
  console.log("authStore", authStore, authStore.isAuthenticated);
  return authStore.isAuthenticated;
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#app2.login .login-container {
  background-color: #045b66 !important;
}
</style>

