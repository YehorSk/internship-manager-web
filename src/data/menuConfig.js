import { ROLES } from '@/constants/roles.js'

export const menuByRole = {
  [ROLES.STUDENT]: [
    { id: 'dashboard', label: 'SideBar.menu.dashboard', icon: 'mdi-view-dashboard', route: '/student-dashboard' },
    { id: 'practices', label: 'SideBar.menu.practices', icon: 'mdi-file-document-outline', route: '/student-praxe' },
    { divider: true },
    { id: 'settings', label: 'SideBar.menu.settings', icon: 'mdi-account-cog-outline', route: '/settings' },
    { id: 'logout', label: 'SideBar.menu.logout', icon: 'mdi-logout', route: null },
  ],
  [ROLES.COMPANY]: [
    { id: 'dashboard', label: 'SideBar.menu.dashboard', icon: 'mdi-view-dashboard', route: '/company-dashboard' },
    { id: 'practices', label: 'SideBar.menu.practices', icon: 'mdi-file-document-outline', route: '/extended-all-praxe' },
    { divider: true },
    { id: 'settings', label: 'SideBar.menu.settings', icon: 'mdi-cog-outline', route: '/settings' },
    { id: 'logout', label: 'SideBar.menu.logout', icon: 'mdi-logout', route: null },
  ],
  [ROLES.SUPERVISOR]: [
    { id: 'dashboard', label: 'SideBar.menu.dashboard', icon: 'mdi-view-dashboard', route: '/supervisor-dashboard' },
    { id: 'students', label: 'SideBar.menu.students', icon: 'mdi-school', route: '/students' },
    { id: 'companies', label: 'SideBar.menu.companies', icon: 'mdi-office-building', route: '/supervisor-company' },
    { id: 'practices', label: 'SideBar.menu.practices', icon: 'mdi-file-document-outline', route: '/extended-all-praxe' },
    { divider: true },
    { id: 'settings', label: 'SideBar.menu.settings', icon: 'mdi-cog-outline', route: '/settings' },
    { id: 'logout', label: 'SideBar.menu.logout', icon: 'mdi-logout', route: null },
  ],
}
