import { nextcloudTheme } from './nextcloud';
import type { ButtonTheme } from './types';

export type { ButtonAction, ButtonRenderProps, ButtonTheme } from './types';

export type ButtonThemeId = ButtonTheme['id'];

export const THEMES: readonly ButtonTheme[] = [nextcloudTheme];

export const DEFAULT_THEME_ID: ButtonThemeId = nextcloudTheme.id;

/** Falls back to the default theme for unknown ids, e.g. one stored by a build that had a theme since removed. */
export function getTheme(id: string): ButtonTheme {
  return THEMES.find((theme) => theme.id === id) ?? nextcloudTheme;
}
