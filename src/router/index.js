import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from '../views/RegistrationPage.vue'
import InfoPage from '../views/InfoPage.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginPage from '../views/LoginPage.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import CompanyDashboard from '@/views/CompanyDashboard.vue'
import SupervisorDashboard from '@/views/SupervisorDashboard.vue'

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
      component: RegistrationPage,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
    },
    {
      path: '/student-dashboard',
      name: 'StudentDashboard',
      component: StudentDashboard,
    },
    {
      path: '/company-dashboard',
      name: 'CompanyDashboard',
      component: CompanyDashboard,
    },
    {
      path: '/supervisor-dashboard',
      name: 'SupervisorDashboard',
      component: SupervisorDashboard,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
