import { parseAppId } from '@/lib/app-page';
import { mountButton } from '@/lib/button';
import { OPEN_OPTIONS, type OpenOptionsMessage } from '@/lib/messages';
import { loadSettings, settingsItem, withDefaults } from '@/lib/settings';

export default defineContentScript({
  matches: ['https://apps.nextcloud.com/apps/*'],
  async main(ctx) {
    const appId = parseAppId(location.pathname);
    if (!appId) return;

    const mount = mountButton({
      document,
      appId,
      settings: await loadSettings(),
      // Content scripts can't open the options page themselves.
      onSetup: () => void browser.runtime.sendMessage({ type: OPEN_OPTIONS } satisfies OpenOptionsMessage),
    });
    if (!mount) return;

    const unwatch = settingsItem.watch((next) => mount.update(withDefaults(next)));
    ctx.onInvalidated(() => {
      unwatch();
      mount.remove();
    });
  },
});
