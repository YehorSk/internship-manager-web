import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from '../views/RegistrationPage.vue'
import InfoPage from '../views/InfoPage.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginPage from '../views/LoginPage.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import CompanyDashboard from '@/views/CompanyDashboard.vue'
import SupervisorDashboard from '@/views/SupervisorDashboard.vue'
import { useAuthStore } from '@/stores/authStore.js'
import StudentPraxePage from '@/views/StudentPraxePage.vue'
import SupervisorPraxePage from '@/views/SupervisorPraxePage.vue'
import { ROLES } from '@/constants/roles.js'
import { hasAccess } from '@/utils/access.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Info',
      component: InfoPage,
      meta: { guestOnly: true  }
    },
    {
      path: '/register',
      name: 'Register',
      component: RegistrationPage,
      meta: { guestOnly: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: { guestOnly: true  }
    },
    {
      path: '/student-dashboard',
      name: 'StudentDashboard',
      component: StudentDashboard,
      meta: { requiresAuth: true, roles: [ROLES.STUDENT] }
    },
    {
      path: '/student-praxe',
      name: 'StudentPraxe',
      component: StudentPraxePage,
      meta: { requiresAuth: true, roles: [ROLES.STUDENT] }
    },
    {
      path: '/company-dashboard',
      name: 'CompanyDashboard',
      component: CompanyDashboard,
      meta: { requiresAuth: true, roles: [ROLES.COMPANY] }
    },
    {
      path: '/supervisor-dashboard',
      name: 'SupervisorDashboard',
      component: SupervisorDashboard,
      meta: { requiresAuth: true, roles: [ROLES.SUPERVISOR] }
    },
    {
      path: '/supervisor-all-praxe',
      name: 'SupervisorPraxePage',
      component: SupervisorPraxePage,
      meta: { requiresAuth: true, roles: [ROLES.SUPERVISOR] }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/reset-password',
      name: 'rest-password',
      component: () => import('../views/ResetPasswordPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/company-activation',
      name: 'company-activation',
      component: () => import('../views/CompanyActivationView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsPage.vue'),
      meta: { requiresAuth: true, },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { left: 0, top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const hasToken = !!authStore.token && authStore.token.trim() !== ''
  const hasUser = !!authStore.user

  if (hasToken && !hasUser && !authStore.isLoggedIn) {
    console.log("Token exists, verifying...")
    await authStore.authenticate()
    console.log("User: " + JSON.stringify(authStore.user))
    console.log("Done")
  }
  const userRoles = authStore.user?.roles?.map(r => r.name) || []

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login' })
    return
  }
  if (to.meta.roles?.length && !hasAccess(userRoles, to.meta.roles))
    return next({ name: 'Login' })

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    if (userRoles.includes(ROLES.STUDENT)) return next({ name: 'StudentDashboard' })
    if (userRoles.includes(ROLES.COMPANY)) return next({ name: 'CompanyDashboard' })
    if (userRoles.includes(ROLES.SUPERVISOR)) return next({ name: 'SupervisorDashboard' })
    return next({ name: 'Info' })
  }

  next()
})

export default router
