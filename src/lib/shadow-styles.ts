/**
 * Applies `css` to a shadow root. Returns nodes to insert into the root alongside its content —
 * empty when the stylesheet could be adopted.
 *
 * apps.nextcloud.com sends `style-src 'self'`, which blocks inline <style> elements but not
 * constructed stylesheets, so adoption comes first and <style> is only a fallback.
 */
export function shadowStyles(root: ShadowRoot, css: string): Node[] {
  const doc = root.ownerDocument;
  try {
    // Constructed in the page's realm: Firefox content scripts otherwise get an Xray-wrapped sheet it refuses to adopt.
    const Sheet = doc.defaultView?.CSSStyleSheet ?? CSSStyleSheet;
    const sheet = new Sheet();
    sheet.replaceSync(css);
    root.adoptedStyleSheets = [sheet];
    return [];
  } catch {
    const style = doc.createElement('style');
    style.textContent = css;
    return [style];
  }
}
