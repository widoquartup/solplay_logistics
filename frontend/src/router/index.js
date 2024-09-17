import { createRouter, createWebHistory } from 'vue-router'
import WarehouseView from '@/components/almacen/WarehouseView.vue'
import CargaToldoView from '@/components/taller/CargaToldoView.vue'
import LoginComponent from '@/components/layout/LoginComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Almacén',
      component: WarehouseView
    },
    {
      path: '/almacen',
      name: 'Almacén',
      component: WarehouseView
    },
    {
      path: '/carga-toldo',
      name: 'Carga de toldos',
      component: CargaToldoView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginComponent
    }
  ]
})

export default router
