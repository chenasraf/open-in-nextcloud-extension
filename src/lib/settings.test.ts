import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import { buttonLabel, DEFAULT_SETTINGS, loadSettings, saveSettings, settingsItem } from './settings';

describe('buttonLabel', () => {
  it('prompts for setup without an instance URL', () => {
    expect(buttonLabel({ instanceUrl: '', instanceName: 'Home' })).toBe('Set up Nextcloud Instance');
  });

  it('uses the generic label without a name', () => {
    expect(buttonLabel({ instanceUrl: 'https://x.test', instanceName: '  ' })).toBe('Open in Nextcloud Instance');
  });

  it('uses the instance name', () => {
    expect(buttonLabel({ instanceUrl: 'https://x.test', instanceName: 'Home Cloud' })).toBe('Open in Home Cloud');
  });
});

describe('settings storage', () => {
  beforeEach(() => fakeBrowser.reset());

  it('returns defaults when nothing is stored', async () => {
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('merges a patch into stored settings', async () => {
    await saveSettings({ instanceUrl: 'https://x.test' });
    await saveSettings({ openTarget: 'current-tab' });
    expect(await loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      instanceUrl: 'https://x.test',
      openTarget: 'current-tab',
    });
  });

  it('fills in fields missing from stored settings', async () => {
    await settingsItem.setValue({ instanceUrl: 'https://x.test' } as never);
    expect(await loadSettings()).toEqual({ ...DEFAULT_SETTINGS, instanceUrl: 'https://x.test' });
  });
});
