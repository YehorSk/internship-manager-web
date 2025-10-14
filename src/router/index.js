import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from '../views/RegistrationPage.vue'
import InfoPage from '../views/InfoPage.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Info',
      component: InfoPage,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegistrationPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    },
  ],
})

export default router
