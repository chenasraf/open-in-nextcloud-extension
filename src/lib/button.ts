import { getTheme, type ButtonAction } from '@/themes';
import { buildAppUrl } from './instance-url';
import { buttonLabel, type Settings } from './settings';
import { shadowStyles } from './shadow-styles';

export const HOST_TAG = 'nextcloud-open-button';

interface Placement {
  selector: string;
  position: InsertPosition;
}

// Tried in order; later entries keep the button visible if the App Store markup shifts.
const PLACEMENTS: Placement[] = [
  { selector: '.header-wrap h1', position: 'afterend' },
  { selector: '.header-wrap', position: 'beforeend' },
  { selector: 'main', position: 'afterbegin' },
];

export interface MountOptions {
  document: Document;
  appId: string;
  settings: Settings;
  onSetup: () => void;
}

export interface ButtonMount {
  host: HTMLElement;
  update(settings: Settings): void;
  remove(): void;
}

export function mountButton({ document, appId, settings, onSetup }: MountOptions): ButtonMount | null {
  const anchor = findAnchor(document);
  if (!anchor) return null;

  document.querySelector(HOST_TAG)?.remove();

  const host = document.createElement(HOST_TAG);
  // Shadow DOM keeps App Store styles (Bootstrap included) from leaking into the themes.
  const root = host.attachShadow({ mode: 'open' });
  anchor.element.insertAdjacentElement(anchor.position, host);

  const render = (current: Settings) => {
    const theme = getTheme(current.buttonTheme);
    const action: ButtonAction = current.instanceUrl
      ? { kind: 'open', href: buildAppUrl(current.instanceUrl, appId), newTab: current.openTarget === 'new-tab' }
      : { kind: 'setup', onClick: onSetup };

    host.dataset.theme = theme.id;
    root.replaceChildren(
      ...shadowStyles(root, theme.css),
      theme.render({ label: buttonLabel(current), action, document }),
    );
  };

  render(settings);

  return {
    host,
    update: render,
    remove: () => host.remove(),
  };
}

function findAnchor(document: Document): { element: Element; position: InsertPosition } | null {
  for (const { selector, position } of PLACEMENTS) {
    const element = document.querySelector(selector);
    if (element) return { element, position };
  }
  return null;
}
