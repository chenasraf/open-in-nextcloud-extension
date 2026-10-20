<p align="center">
  <img src="assets/icon.svg" alt="" width="96" height="96" />
</p>

<h1 align="center">Open in Nextcloud</h1>

A Chrome and Firefox extension that adds an **Open in Nextcloud Instance** button to app pages on
[apps.nextcloud.com](https://apps.nextcloud.com). The button takes you to the app in your own
instance's app settings, ready to install or enable:

```
https://apps.nextcloud.com/apps/pantry
  → https://<your instance>/settings/apps/search/pantry?q=pantry
```

Click the toolbar icon to set:

- **Instance URL**: the address of your Nextcloud. Pasting any URL from your instance works; the
  page-specific part is stripped.
- **Instance name** (optional): changes the button to read **Open in &lt;name&gt;**.
- **Open the app in**: a new tab, or the current tab.

Until an instance URL is set, the button reads **Set up Nextcloud Instance** and opens the settings.

## Development

Built with [WXT](https://wxt.dev) (Vite), TypeScript and Vitest, using pnpm.

```sh
pnpm install
pnpm dev            # Chrome, with hot reload
pnpm dev:firefox    # Firefox
pnpm test
pnpm typecheck
pnpm build          # → dist/chrome-mv3
pnpm build:firefox  # → dist/firefox-mv2
pnpm zip            # store-ready zip in dist/
pnpm zip:firefox
```

To load a build by hand, open `chrome://extensions` (Developer mode → Load unpacked → `dist/chrome-mv3`)
or `about:debugging#/runtime/this-firefox` (Load Temporary Add-on → `dist/firefox-mv2/manifest.json`).

### Releases

Versions come from [release-please](https://github.com/googleapis/release-please), driven by
[Conventional Commits](https://www.conventionalcommits.org) on `master`. Merging its release PR
bumps `package.json` (and with it the manifest version), tags the release and attaches the Chrome,
Firefox and sources zips to it.

### Layout

| Path                            | Purpose                                                                    |
| ------------------------------- | -------------------------------------------------------------------------- |
| `src/entrypoints/content.ts`    | Runs on App Store app pages; mounts the button and follows settings changes |
| `src/entrypoints/background.ts` | Opens the settings page when the button is clicked without an instance set |
| `src/entrypoints/popup/`        | Toolbar popup                                                              |
| `src/entrypoints/options/`      | Full-page settings, same form as the popup                                 |
| `src/components/settings-form/` | The settings form and live button preview                                  |
| `src/lib/`                      | URL normalization, app page parsing, settings storage, button mounting     |
| `src/themes/`                   | Button themes                                                              |
| `assets/icon.svg`               | Source for `public/icon/*.png`                                             |

### Button themes

A theme is a `ButtonTheme` (`src/themes/types.ts`): an id, a display name, a stylesheet and a
`render()` that builds the button element. Register it in `THEMES` in `src/themes/index.ts`. The
selected theme is stored in the `buttonTheme` setting. Once more than one theme is registered, a
**Button style** picker shows up in the settings.

The button renders inside a shadow root, so App Store styles don't leak in. CSS custom properties
still inherit through the shadow root, though, and the default `nextcloud` theme reads the App
Store's own variables (`--color-primary` etc.) to stay in step with the site.

Theme CSS is applied as a constructed stylesheet, not a `<style>` element, because the App Store's
CSP (`style-src 'self'`) blocks inline styles.

### Icons

```sh
for s in 16 32 48 96 128; do rsvg-convert -w $s -h $s assets/icon.svg -o public/icon/$s.png; done
```
