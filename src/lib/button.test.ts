import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HOST_TAG, mountButton } from './button';
import { DEFAULT_SETTINGS, type Settings } from './settings';

const configured: Settings = {
  ...DEFAULT_SETTINGS,
  instanceUrl: 'https://cloud.example.com',
  instanceName: 'Home Cloud',
};

function link(host: HTMLElement): HTMLAnchorElement {
  return host.shadowRoot!.querySelector('a')!;
}

describe('mountButton', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main class="container" id="body">
        <div class="header-wrap"><h1>Pantry</h1></div>
      </main>`;
  });

  it('inserts the button right after the app title', () => {
    const mount = mountButton({ document, appId: 'pantry', settings: configured, onSetup: vi.fn() })!;
    expect(document.querySelector('.header-wrap h1')!.nextElementSibling).toBe(mount.host);
  });

  it('links to the app in the instance, in a new tab', () => {
    const mount = mountButton({ document, appId: 'pantry', settings: configured, onSetup: vi.fn() })!;
    const a = link(mount.host);
    expect(a.href).toBe('https://cloud.example.com/settings/apps/search/pantry?q=pantry');
    expect(a.target).toBe('_blank');
    expect(a.rel).toBe('noopener noreferrer');
    expect(a.textContent).toBe('Open in Home Cloud');
  });

  it('opens in the current tab when configured to', () => {
    const mount = mountButton({
      document,
      appId: 'pantry',
      settings: { ...configured, openTarget: 'current-tab' },
      onSetup: vi.fn(),
    })!;
    expect(link(mount.host).target).toBe('');
  });

  it('asks for setup when no instance is configured', () => {
    const onSetup = vi.fn();
    const mount = mountButton({ document, appId: 'pantry', settings: DEFAULT_SETTINGS, onSetup })!;
    const a = link(mount.host);
    expect(a.textContent).toBe('Set up Nextcloud Instance');
    a.click();
    expect(onSetup).toHaveBeenCalledOnce();
  });

  it('re-renders on update', () => {
    const mount = mountButton({ document, appId: 'pantry', settings: DEFAULT_SETTINGS, onSetup: vi.fn() })!;
    mount.update({ ...configured, instanceName: '' });
    expect(link(mount.host).textContent).toBe('Open in Nextcloud Instance');
    expect(document.querySelectorAll(HOST_TAG)).toHaveLength(1);
  });

  it('styles the button without an inline <style>, which the App Store CSP blocks', () => {
    const mount = mountButton({ document, appId: 'pantry', settings: configured, onSetup: vi.fn() })!;
    const root = mount.host.shadowRoot!;
    expect(root.adoptedStyleSheets).toHaveLength(1);
    expect(root.querySelector('style')).toBeNull();
  });

  it('falls back to another placement when the title is missing', () => {
    document.body.innerHTML = '<main></main>';
    const mount = mountButton({ document, appId: 'pantry', settings: configured, onSetup: vi.fn() })!;
    expect(document.querySelector('main')!.firstElementChild).toBe(mount.host);
  });

  it('does nothing on an unrecognized page', () => {
    document.body.innerHTML = '<div></div>';
    expect(mountButton({ document, appId: 'pantry', settings: configured, onSetup: vi.fn() })).toBeNull();
  });

  it('falls back to the default theme for an unknown theme id', () => {
    const mount = mountButton({
      document,
      appId: 'pantry',
      settings: { ...configured, buttonTheme: 'gone' },
      onSetup: vi.fn(),
    })!;
    expect(mount.host.dataset.theme).toBe('nextcloud');
  });
});
