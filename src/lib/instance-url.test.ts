import { describe, expect, it } from 'vitest';
import { buildAppUrl, normalizeInstanceUrl } from './instance-url';

describe('normalizeInstanceUrl', () => {
  it.each([
    ['https://cloud.example.com', 'https://cloud.example.com'],
    ['https://cloud.example.com/', 'https://cloud.example.com'],
    ['  cloud.example.com  ', 'https://cloud.example.com'],
    ['http://192.168.1.10:8080', 'http://192.168.1.10:8080'],
    ['https://example.com/nextcloud/', 'https://example.com/nextcloud'],
    ['https://cloud.example.com/apps/files/?dir=/', 'https://cloud.example.com'],
    ['https://cloud.example.com/index.php/apps/dashboard/', 'https://cloud.example.com/index.php'],
    ['https://example.com/nc/settings/user', 'https://example.com/nc'],
    ['https://cloud.example.com/login?redirect_url=x#y', 'https://cloud.example.com'],
    ['HTTPS://Cloud.Example.com', 'https://cloud.example.com'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeInstanceUrl(input)).toEqual({ ok: true, url: expected });
  });

  it.each(['', '   ', 'ftp://cloud.example.com', 'https://', 'not a url'])('rejects %j', (input) => {
    expect(normalizeInstanceUrl(input).ok).toBe(false);
  });
});

describe('buildAppUrl', () => {
  it('points at the app search in the instance settings', () => {
    expect(buildAppUrl('https://cloud.example.com', 'pantry')).toBe(
      'https://cloud.example.com/settings/apps/search/pantry?q=pantry',
    );
  });

  it('keeps an instance subpath', () => {
    expect(buildAppUrl('https://example.com/nextcloud', 'files_retention')).toBe(
      'https://example.com/nextcloud/settings/apps/search/files_retention?q=files_retention',
    );
  });
});
