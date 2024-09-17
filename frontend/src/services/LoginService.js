// loginService.js
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
// import router from '@/router';

class LoginService {
  constructor(baseURL = import.meta.env.VITE_SOLPLAY_API_URL ) {
    this.baseURL = baseURL;
    this.authStore = null;
  }
  initializeStore() {
    if (!this.authStore) {
      this.authStore = useAuthStore();
    }
  }

  goToLogin(){
    this.authStore.logout();
    return null;
  }

  async getHeaders() {
    const token = await this.token();
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}
  async token() {
    this.initializeStore();
    if (!this.authStore.token) {
      return await this.getNewTokens();
    }

    if (this.isTokenExpired()) {
      return await this.refreshToken();
    }

    return this.authStore.token;
  }

  async getNewTokens() {
    this.initializeStore();
    try {
      const result = await this.getToken();
      if (result.token && result.refreshToken) {
        this.authStore.setToken(result.token);
        this.authStore.setRefreshToken(result.refreshToken);
        return result.token;
      }
    } catch (error) {
      // console.error('Error getting new tokens:', error);
    }
    return null;
  }


  async refreshToken() {
    this.initializeStore();
    console.log("using refreshToken");
    if (!this.authStore.refreshToken) {
      return this.goToLogin();
    }

    try {
      const result = await this.getRefreshToken();
      if (result.token) {
        this.authStore.setToken(result.token);
        if (result.refreshToken) {
          this.authStore.setRefreshToken(result.refreshToken);
        }
        return result.token;
      }
    } catch (error) {
      // console.error('Error refreshing token:', error);
      return this.goToLogin();

      // return this.getNewTokens();
    }
  }

  // async getToken() {
  //   try {
  //     const data = { apiKey: import.meta.env.VITE_SOLPLAY_API_KEY || '123456' };
  //     const response = await axios.post(`${this.baseURL}/api-key`, data, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error getting token:', error);
  //     throw error;
  //   }
  // }

  async getRefreshToken() {
    try {
      console.log("using getRefreshToken");
      const response = await axios.post(`${this.baseURL}/auth/access/refresh`, {
        refreshtoken: this.authStore.refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return this.goToLogin();

      // throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await axios.post(`${this.baseURL}/auth/access`, {
        email: username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth': 'auth'
        }
      });
      const result = response.data;
      if (result.token && result.refreshToken) {
        this.initializeStore() 
        this.authStore.setToken(result.token);
        this.authStore.setRefreshToken(result.refreshToken);
        this.getUser();
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async getUser(){
    try {
      const response = await axios.get(`${this.baseURL}/auth/user/logged/user-data`,  {
        headers: await this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting carga toldo:', error);
      throw error;
    }
  }


  isTokenExpired() {
    // Implementa la lógica para verificar si el token ha expirado
    // Por ejemplo, puedes decodificar el JWT y verificar la fecha de expiración
    // Por ahora, retornamos false como placeholder
    return false;
  }
}


export default new LoginService();