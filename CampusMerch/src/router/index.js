import { createRouter, createWebHistory } from 'vue-router'
import login from '../login.vue'
import register from '../register.vue'
import LeaderPage from '../LeaderPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LeaderPage',
      component: LeaderPage,
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    
  ],
})

export default router
