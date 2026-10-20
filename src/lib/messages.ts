export const OPEN_OPTIONS = 'open-options';

export interface OpenOptionsMessage {
  type: typeof OPEN_OPTIONS;
}

export function isOpenOptionsMessage(message: unknown): message is OpenOptionsMessage {
  return typeof message === 'object' && message !== null && (message as { type?: unknown }).type === OPEN_OPTIONS;
}
