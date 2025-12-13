import { logger } from './logger';
import { config } from '../config';

/**
 * Storage utilities for managing LocalStorage quota
 */

export const STORAGE_CONFIG = {
  MAX_ORBS: config.maxOrbs,
  QUOTA_WARNING_THRESHOLD: config.storageQuotaWarning,
  QUOTA_ERROR_THRESHOLD: 0.95, // Error at 95% of quota
};

/**
 * Check storage quota and usage
 */
export async function checkStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
  available: number;
}> {
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? usage / quota : 0;
      const available = quota - usage;

      return { usage, quota, percentage, available };
    } catch (error) {
      logger.error('Failed to estimate storage quota:', error);
    }
  }

  // Fallback if API not available
  return { usage: 0, quota: 0, percentage: 0, available: 0 };
}

/**
 * Warn if storage quota is nearly exceeded
 */
export async function warnIfQuotaNearlyExceeded(): Promise<void> {
  const { percentage } = await checkStorageQuota();

  if (percentage >= STORAGE_CONFIG.QUOTA_ERROR_THRESHOLD) {
    logger.error(
      `Storage quota critically low: ${(percentage * 100).toFixed(1)}%. Please delete some orbs.`
    );
  } else if (percentage >= STORAGE_CONFIG.QUOTA_WARNING_THRESHOLD) {
    logger.warn(
      `Storage quota nearly exceeded: ${(percentage * 100).toFixed(1)}%`
    );
  }
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get estimated LocalStorage size
 */
export function getLocalStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      total += key.length + (localStorage[key]?.length || 0);
    }
  }
  return total * 2; // UTF-16 encoding (2 bytes per character)
}

/**
 * Check if we can add more orbs
 */
export function canAddMoreOrbs(currentCount: number): {
  canAdd: boolean;
  reason?: string;
} {
  if (currentCount >= STORAGE_CONFIG.MAX_ORBS) {
    return {
      canAdd: false,
      reason: `Maximum of ${STORAGE_CONFIG.MAX_ORBS} orbs allowed`,
    };
  }

  return { canAdd: true };
}
