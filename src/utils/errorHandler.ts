import {logger} from './logger';
export function handleError(error: unknown, context = 'Unknown'): string {
  const msg = error instanceof Error ? error.message : String(error);
  logger.error([], msg);
  return msg;
}
