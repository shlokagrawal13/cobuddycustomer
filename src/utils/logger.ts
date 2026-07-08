const isDev = __DEV__;
export const logger = {
  log: (...args: unknown[]) => isDev && console.log('[CoBuddy]', ...args),
  warn: (...args: unknown[]) => isDev && console.warn('[CoBuddy:WARN]', ...args),
  error: (...args: unknown[]) => console.error('[CoBuddy:ERROR]', ...args),
  info: (...args: unknown[]) => isDev && console.info('[CoBuddy:INFO]', ...args),
};
