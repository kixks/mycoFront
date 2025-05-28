import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: () => import('@/views/Unauthorized_Page/LandingPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Unauthorized_Page/login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Unauthorized_Page/register.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Authorized_Page/Dashboard.vue'),
  },
]

const router = createRouter({ history: createWebHistory(), routes })

export default router
