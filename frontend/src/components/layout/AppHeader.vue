<template>
  <header class="app-header">
    <div class="logo">
      <img src="@/assets/logo-solplay.png" alt="Solplay Logo">
    </div>
    <div class="user-info">
      <div class="user-icon" @click="showUserInfo = !showUserInfo">
        <v-icon>mdi-account</v-icon>
      </div>
      <div class="user-details" v-if="showUserInfo">
        <p>{{ user?.name }}</p>
        <p>{{ user?.email }}</p>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import LoginService from '@/services/LoginService';
import { useAuthStore } from '@/stores/authStore';

const user = ref(null)
const showUserInfo = ref(false)
const authStore = useAuthStore();


onMounted(async () => {
  user.value = await LoginService.getUser();
});



function logout(){
  authStore.logout();
}

</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  max-height: 50px;
}

.logo img {
  margin-top:7px;
  max-height: 30px;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
}

.user-icon {
  cursor: pointer;
  margin-right: 1rem;
}

.user-details {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #333;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}
</style>