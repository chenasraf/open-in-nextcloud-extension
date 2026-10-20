import { describe, expect, it } from 'vitest';
import { parseAppId } from './app-page';

describe('parseAppId', () => {
  it.each([
    ['/apps/pantry', 'pantry'],
    ['/apps/pantry/', 'pantry'],
    ['/apps/files_retention', 'files_retention'],
  ])('%s → %s', (path, id) => {
    expect(parseAppId(path)).toBe(id);
  });

  it.each(['/', '/apps', '/apps/', '/apps/pantry/releases', '/categories/tools', '/featured'])(
    'ignores %s',
    (path) => {
      expect(parseAppId(path)).toBeNull();
    },
  );
});
