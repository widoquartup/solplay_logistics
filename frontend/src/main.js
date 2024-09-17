import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import WarehouseView from './components/almacen/WarehouseView.vue'
import CargaToldoView from './components/taller/CargaToldoView.vue'
import { createPinia } from 'pinia'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import LoginComponent from './components/layout/LoginComponent.vue'
const routes = [
  { path: '/', component: WarehouseView },
  { path: '/almacen', component: WarehouseView },
  { path: '/login', component: LoginComponent },
  { path: '/carga-toldo', component: CargaToldoView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
})
const pinia = createPinia()


const app = createApp(App)
app.use(pinia)
app.use(vuetify).use(router).mount('#app')