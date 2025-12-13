/**
 * Structured logging utility
 * - console.log/info are only available in development
 * - console.warn/error are always available
 */

const isDev = import.meta.env.DEV;

export const logger = {
  debug: isDev ? console.log.bind(console) : () => {},
  info: isDev ? console.info.bind(console) : () => {},
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
