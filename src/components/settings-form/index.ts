import './style.css';
import { normalizeInstanceUrl } from '@/lib/instance-url';
import { shadowStyles } from '@/lib/shadow-styles';
import { loadSettings, saveSettings, buttonLabel, type OpenTarget, type Settings } from '@/lib/settings';
import { getTheme, THEMES } from '@/themes';

const SAVE_DELAY_MS = 300;

const TEMPLATE = /* html */ `
  <form class="settings" novalidate>
    <header class="settings-header">
      <img src="/icon/48.png" alt="" width="32" height="32" />
      <h1>Open in Nextcloud</h1>
    </header>

    <label class="field">
      <span class="field-label">Instance URL</span>
      <input name="instanceUrl" type="text" inputmode="url" autocomplete="url" spellcheck="false"
        placeholder="cloud.example.com" aria-describedby="instanceUrl-error" />
      <span class="field-error" id="instanceUrl-error" role="alert" hidden></span>
    </label>

    <label class="field">
      <span class="field-label">Instance name <span class="optional">(optional)</span></span>
      <input name="instanceName" type="text" autocomplete="off" placeholder="Nextcloud Instance" />
    </label>

    <fieldset class="field">
      <legend class="field-label">Open the app in</legend>
      <label class="choice"><input type="radio" name="openTarget" value="new-tab" /> A new tab</label>
      <label class="choice"><input type="radio" name="openTarget" value="current-tab" /> The current tab</label>
    </fieldset>

    <label class="field" data-theme-field hidden>
      <span class="field-label">Button style</span>
      <select name="buttonTheme"></select>
    </label>

    <div class="field">
      <span class="field-label">Preview</span>
      <div class="preview" data-preview></div>
    </div>

    <p class="status" data-status aria-live="polite"></p>
  </form>
`;

export async function renderSettingsForm(container: HTMLElement): Promise<void> {
  container.innerHTML = TEMPLATE;

  const form = container.querySelector('form')!;
  const fields = form.elements as HTMLFormControlsCollection & {
    instanceUrl: HTMLInputElement;
    instanceName: HTMLInputElement;
    openTarget: RadioNodeList;
    buttonTheme: HTMLSelectElement;
  };
  const urlError = form.querySelector<HTMLElement>('#instanceUrl-error')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const themeField = form.querySelector<HTMLElement>('[data-theme-field]')!;
  const previewHost = form.querySelector<HTMLElement>('[data-preview]')!;
  const previewRoot = previewHost.attachShadow({ mode: 'open' });

  for (const theme of THEMES) {
    fields.buttonTheme.add(new Option(theme.name, theme.id));
  }
  themeField.hidden = THEMES.length < 2;

  const settings = await loadSettings();
  fields.instanceUrl.value = settings.instanceUrl;
  fields.instanceName.value = settings.instanceName;
  fields.openTarget.value = settings.openTarget;
  fields.buttonTheme.value = settings.buttonTheme;
  renderPreview(previewRoot, settings);

  const readForm = (): { settings: Partial<Settings>; preview: Settings } => {
    const result = normalizeInstanceUrl(fields.instanceUrl.value);
    const emptyUrl = !fields.instanceUrl.value.trim();
    const showError = !result.ok && !emptyUrl;
    urlError.hidden = !showError;
    urlError.textContent = showError ? result.error : '';
    fields.instanceUrl.toggleAttribute('aria-invalid', showError);

    const patch: Partial<Settings> = {
      instanceName: fields.instanceName.value.trim(),
      openTarget: fields.openTarget.value as OpenTarget,
      buttonTheme: fields.buttonTheme.value,
    };
    // An invalid URL keeps the last good one stored; clearing the field unsets it.
    if (result.ok) patch.instanceUrl = result.url;
    else if (emptyUrl) patch.instanceUrl = '';

    return { settings: patch, preview: { ...settings, ...patch } };
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const scheduleSave = (delay: number) => {
    clearTimeout(timer);
    status.textContent = '';
    const { settings: patch, preview } = readForm();
    renderPreview(previewRoot, preview);
    timer = setTimeout(async () => {
      Object.assign(settings, await saveSettings(patch));
      status.textContent = 'Saved';
    }, delay);
  };

  form.addEventListener('input', () => scheduleSave(SAVE_DELAY_MS));
  form.addEventListener('change', () => scheduleSave(0));
  form.addEventListener('submit', (event) => event.preventDefault());
  fields.instanceUrl.addEventListener('blur', () => {
    const result = normalizeInstanceUrl(fields.instanceUrl.value);
    if (result.ok) fields.instanceUrl.value = result.url;
  });
}

function renderPreview(root: ShadowRoot, settings: Settings): void {
  const theme = getTheme(settings.buttonTheme);
  // The theme's :host margin is meant for the App Store page, not this form.
  const styles = shadowStyles(root, `${theme.css}\n:host { margin: 0; }`);
  const button = theme.render({
    label: buttonLabel(settings),
    action: settings.instanceUrl
      ? { kind: 'open', href: '#', newTab: settings.openTarget === 'new-tab' }
      : { kind: 'setup', onClick: () => {} },
    document,
  });
  button.addEventListener('click', (event) => event.preventDefault());
  button.tabIndex = -1;
  root.replaceChildren(...styles, button);
}
