import { ROLES } from '@/constants/roles.js'

export const menuByRole = {
  [ROLES.STUDENT]: [
    { id: 'dashboard', label: 'Prehľad', icon: 'mdi-view-dashboard', route: '/student-dashboard' },
    { id: 'practices', label: 'Zoznam praxí', icon: 'mdi-file-document-outline', route: '/student-praxe' },
    { divider: true },
    { id: 'settings', label: 'Nastavenia profilu', icon: 'mdi-account-cog-outline', route: '/settings' },
    { id: 'logout', label: 'Odhlásiť sa', icon: 'mdi-logout', route: null },
  ],
  [ROLES.COMPANY]: [
    { id: 'dashboard', label: 'Prehľad', icon: 'mdi-view-dashboard', route: '/company-dashboard' },
    { id: 'practices', label: 'Zoznam praxí', icon: 'mdi-file-document-outline', route: '/extended-all-praxe' },
    { divider: true },
    { id: 'settings', label: 'Nastavenia profilu', icon: 'mdi-cog-outline', route: '/settings' },
    { id: 'logout', label: 'Odhlásiť sa', icon: 'mdi-logout', route: null },
  ],
  [ROLES.SUPERVISOR]: [
    { id: 'dashboard', label: 'Prehľad', icon: 'mdi-view-dashboard', route: '/supervisor-dashboard' },
    { id: 'students', label: 'Študenti', icon: 'mdi-school', route: '/supervisor-all-students' },
    { id: 'companies', label: 'Firmy', icon: 'mdi-office-building', route: '/supervisor-company' },
    { id: 'practices', label: 'Zoznam praxí', icon: 'mdi-file-document-outline', route: '/extended-all-praxe' },
    { divider: true },
    { id: 'settings', label: 'Nastavenia profilu', icon: 'mdi-cog-outline', route: '/settings' },
    { id: 'logout', label: 'Odhlásiť sa', icon: 'mdi-logout', route: null },
  ],
}
