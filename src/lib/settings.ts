import { storage } from 'wxt/utils/storage';
import { DEFAULT_THEME_ID, type ButtonThemeId } from '@/themes';

export type OpenTarget = 'new-tab' | 'current-tab';

export interface Settings {
  /** Normalized instance base URL, without a trailing slash. Empty when not configured. */
  instanceUrl: string;
  instanceName: string;
  openTarget: OpenTarget;
  buttonTheme: ButtonThemeId;
}

export const DEFAULT_SETTINGS: Settings = {
  instanceUrl: '',
  instanceName: '',
  openTarget: 'new-tab',
  buttonTheme: DEFAULT_THEME_ID,
};

export const settingsItem = storage.defineItem<Settings>('sync:settings', {
  fallback: DEFAULT_SETTINGS,
  version: 1,
});

/** Fills in fields missing from stored settings, so adding a setting never needs a migration. */
export function withDefaults(stored: Partial<Settings> | null | undefined): Settings {
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function loadSettings(): Promise<Settings> {
  return withDefaults(await settingsItem.getValue());
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await loadSettings()), ...patch };
  await settingsItem.setValue(next);
  return next;
}

export function buttonLabel(settings: Pick<Settings, 'instanceUrl' | 'instanceName'>): string {
  if (!settings.instanceUrl) return 'Set up Nextcloud Instance';
  const name = settings.instanceName.trim();
  return name ? `Open in ${name}` : 'Open in Nextcloud Instance';
}
