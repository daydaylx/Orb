/**
 * Application configuration
 * Values from environment variables with fallbacks
 */

export const config = {
  // App version
  version: import.meta.env.VITE_APP_VERSION || '0.0.0',

  // Debug mode
  debug: import.meta.env.VITE_ENABLE_DEBUG === 'true' || import.meta.env.DEV,

  // Storage limits
  maxOrbs: Number(import.meta.env.VITE_MAX_ORBS) || 50,
  storageQuotaWarning: Number(import.meta.env.VITE_STORAGE_QUOTA_WARNING) || 0.8,

  // Environment
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Type-safe config access
export type AppConfig = typeof config;
