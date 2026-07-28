export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;

export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  NOTES: {
    BASE: '/notes',
    BY_ID: (id: string) => `/notes/${id}`,
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'notes_app_token',
} as const;
