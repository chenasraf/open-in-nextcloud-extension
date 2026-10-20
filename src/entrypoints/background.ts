import { isOpenOptionsMessage } from '@/lib/messages';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message) => {
    if (isOpenOptionsMessage(message)) {
      void browser.runtime.openOptionsPage();
    }
  });
});
