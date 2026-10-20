import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  manifest: {
    name: 'Open in Nextcloud',
    description: 'Adds a button to Nextcloud App Store pages that opens the app in your own Nextcloud instance.',
    permissions: ['storage'],
    browser_specific_settings: {
      gecko: {
        id: 'open-in-nextcloud@casraf.dev',
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
});
