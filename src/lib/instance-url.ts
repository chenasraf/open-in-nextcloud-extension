export type NormalizeResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// Users tend to paste whatever is in their address bar, e.g.
// https://cloud.example.com/index.php/apps/files/?dir=/ — everything from the
// first route segment on is page-specific and gets dropped. A leading
// /index.php is kept, since instances without pretty URLs need it.
const ROUTE_SEGMENT = /\/(?:apps|settings|login|s|f)(?:\/|$)/;

export function normalizeInstanceUrl(input: string): NormalizeResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: 'Enter your Nextcloud instance URL.' };
  }

  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { ok: false, error: 'That doesn’t look like a valid URL.' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: 'The URL must start with https:// or http://.' };
  }
  if (!parsed.hostname) {
    return { ok: false, error: 'That doesn’t look like a valid URL.' };
  }

  let path = parsed.pathname;
  const route = ROUTE_SEGMENT.exec(path);
  if (route) {
    path = path.slice(0, route.index);
  }
  path = path.replace(/\/+$/, '');

  return { ok: true, url: `${parsed.origin}${path}` };
}

export function buildAppUrl(instanceUrl: string, appId: string): string {
  const id = encodeURIComponent(appId);
  return `${instanceUrl}/settings/apps/search/${id}?q=${id}`;
}
