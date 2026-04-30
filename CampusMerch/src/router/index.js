import { createRouter, createWebHistory } from 'vue-router'
import CustomerHomepage from '../views/Customer/CustomerHomepage.vue'
import register from '../register.vue'
import MyOrders from '../views/Customer/MyOrders.vue'
import PersonCenter from '../views/Customer/PersonCenter.vue'
import ProductDetails from '../views/Customer/ProductDetails.vue'
import ProductHall from '../views/Customer/ProductHall.vue'
import UploadForeign from '../views/Customer/UploadForeign.vue'
import DataReport from '../views/Administrator/DataReport.vue'
import AdministratorHomepage from '../views/Administrator/AdministratorHomepage.vue'
import ProductManagement from '../views/Administrator/ProductManagement.vue'
import AdminLayout from '../views/Administrator/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'CustomerHomepage',
      component: CustomerHomepage,
      children: [
        {
          path: '',
          name: 'ProductHall',
          component: ProductHall,
        },
        {
          path: 'myorders',
          name: 'MyOrders',
          component: MyOrders,
        },
        {
          path: 'personcenter',
          name: 'PersonCenter',
          component: PersonCenter,
        },
        {
          path: 'productdetails',
          name: 'ProductDetails',
          component: ProductDetails,
        },
        {
          path: 'producthall',
          name: 'ProductHallPage',
          component: ProductHall,
        },
        {
          path: 'uploadforeign',
          name: 'UploadForeign',
          component: UploadForeign,
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/admin',
      name: 'AdminLayout',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'AdministratorHomepage',
          component: AdministratorHomepage,
        },
        {
          path: 'products',
          name: 'ProductManagement',
          component: ProductManagement,
        },
        {
          path: 'orders',
          name: 'OrderReview',
          component: () => import('../views/Administrator/OrderReview.vue'),
        },
        {
          path: 'custom',
          name: 'CustomOrders',
          component: () => import('../views/Administrator/CustomOrders.vue'),
        },
        {
          path: 'report',
          name: 'DataReport',
          component: DataReport,
        },
        {
          path: 'settings',
          name: 'SystemSettings',
          component: () => import('../views/Administrator/SystemSettings.vue'),
        },
      ],
    },
  ],
})

export default router
