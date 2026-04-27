import { createRouter, createWebHistory } from 'vue-router'
import register from '../views/Customer/register.vue'
import CustomerHomepage from '../views/Customer/CustomerHomepage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'CustomerHomepage',
      component: CustomerHomepage,
    }, 
    {
      path: '/register',
      name: 'register',
      component: register,
    },
  ],
})

export default router
