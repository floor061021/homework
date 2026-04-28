import { createRouter, createWebHistory } from 'vue-router'
import CustomerHomepage from '../views/Customer/CustomerHomepage.vue'
import register from '../views/Customer/register.vue'
import MyOrders from '../views/Customer/MyOrders.vue'
import PersonCenter from '../views/Customer/PersonCenter.vue'
import ProductDetails from '../views/Customer/ProductDetails.vue'
import ProductHall from '../views/Customer/ProductHall.vue'
import DataReport from '../views/Administrator/DataReport.vue'
import  AdministratorHomepage from '../views/Administrator/AdministratorHomepage.vue'
import ProductManagement from '../views/Administrator/ProductManagement.vue'

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
    {
      path: '/myorders',
      name: 'MyOrders',
      component: MyOrders,
    },
    {
      path: '/personcenter',
      name: 'PersonCenter',
      component: PersonCenter,
    },
    {
      path: '/productdetails',
      name: 'ProductDetails',
      component: ProductDetails,
    },
    {
      path: '/producthall',
      name: 'ProductHall',
      component: ProductHall,
    },
    {
      path: '/datareport',
      name: 'DataReport',
      component: DataReport,
    },
    
    {
      path: '/productmanagement',
      name: 'ProductManagement',
      component: ProductManagement,
    },
    {
      path: '/administratorhomepage',
      name: 'AdministratorHomepage',
      component: AdministratorHomepage,
    },
  ],
})

export default router
