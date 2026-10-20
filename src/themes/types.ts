export type ButtonAction =
  | { kind: 'open'; href: string; newTab: boolean }
  | { kind: 'setup'; onClick: () => void };

export interface ButtonRenderProps {
  label: string;
  action: ButtonAction;
  document: Document;
}

export interface ButtonTheme {
  id: string;
  /** Shown in the settings UI when more than one theme is available. */
  name: string;
  /** Stylesheet injected into the button's shadow root. Page CSS custom properties still inherit into it. */
  css: string;
  render(props: ButtonRenderProps): HTMLElement;
}
