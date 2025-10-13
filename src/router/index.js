import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordPage.vue'),
      meta: { guestOnly: true },
    },
    {
     path: '/new-password',
      name: 'new-password',
      component: () => import('../views/NewPasswordPage.vue'),
      meta: { guestOnly: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = false // сюда потом реальную проверку (например, по токену)
  if (to.meta.guestOnly && isAuthenticated) return next({ name: 'home' })
  next()
})

export default router
