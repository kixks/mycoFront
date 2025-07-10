import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // UNAUTHORIZED PAGES
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
    path: '/google-auth-success',
    name: 'authSuccess',
    component: () => import('@/views/Authorized_Page/GoogleAuthSuccess.vue'),
  },

  // AUTHORIZED PAGES (Protected)
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Authorized_Page/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('@/views/Authorized_Page/Messages.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Authorized_Page/Settings.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/datasets',
    name: 'datasets',
    component: () => import('@/views/Authorized_Page/Datasets.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Global Guard: Protect routes that need auth
 */
router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem('authToken')
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authToken) {
    // ❌ Not logged in, redirect to Landing Page
    next({ name: 'LandingPage' })
  } else {
    // ✅ Allow navigation
    next()
  }
})

export default router
