import css from './style.css?inline';
import { createIcon, ICON_ARROW_FORWARD, ICON_OPEN_IN_NEW, ICON_SETTINGS } from '../icons';
import type { ButtonTheme } from '../types';

export const nextcloudTheme: ButtonTheme = {
  id: 'nextcloud',
  name: 'Nextcloud',
  css,
  render({ label, action, document }) {
    const link = document.createElement('a');
    link.className = 'button';
    link.setAttribute('part', 'button');

    const icon = document.createElement('span');
    icon.className = 'icon';

    const text = document.createElement('span');
    text.className = 'label';
    text.textContent = label;

    if (action.kind === 'open') {
      link.href = action.href;
      if (action.newTab) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      icon.append(createIcon(document, action.newTab ? ICON_OPEN_IN_NEW : ICON_ARROW_FORWARD));
      link.append(text, icon);
    } else {
      link.href = '#';
      link.classList.add('setup');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        action.onClick();
      });
      icon.append(createIcon(document, ICON_SETTINGS));
      link.append(icon, text);
    }

    return link;
  },
};
