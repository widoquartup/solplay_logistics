<template>
  <div v-if="!isLoggedIn" class="login-container">
    <img src="@/assets/logo-solplay.png" alt="Company Logo" class="login-logo" />
    <form class="login-form" @submit.prevent="login">
      <label for="email">Usuario:</label>
      <input id="email" v-model="email" required />
      <label for="password">Contraseña:</label>
      <input id="password" v-model="password" type="password" required />
      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
  <div v-else>
    <!-- Render the main application content -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import LoginService from '../../services/LoginService';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const isLoggedIn = computed(() => {
  return authStore.token !== null && authStore.refreshToken !== null;
});

const login = async () => {
  try {
    const { token, refreshToken } = await LoginService.login(email.value, password.value);
    authStore.setToken(token);
    authStore.setRefreshToken(refreshToken);
    // Redirect to the main application content
    router.push('/dashboard'); // Adjust the route as needed
  } catch (error) {
    console.error('Error logging in:', error);
    // Display an error message to the user
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.login-logo {
  width: 200px;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-form label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-form input {
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.7rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>