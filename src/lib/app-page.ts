const APP_PATH = /^\/apps\/([a-z\d_]+)\/?$/i;

/** Returns the app id for an App Store app page, or null for any other page (including app subpages such as releases). */
export function parseAppId(pathname: string): string | null {
  return APP_PATH.exec(pathname)?.[1] ?? null;
}
