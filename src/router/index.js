import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/LandingPage.vue'),
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/AccountPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutPage.vue'),
  },
  {
    path: '/order-confirmation/:orderId',
    name: 'order-confirmation',
    component: () => import('../views/OrderConfirmation.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const { isAuthenticated, openAuthModal } = useAuth()
    if (!isAuthenticated.value) {
      openAuthModal('login')
      return { name: 'home' }
    }
  }
})

export default router
