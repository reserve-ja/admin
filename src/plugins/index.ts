/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import router from '../router';
import { queryPlugin, queryOptions } from './tanstack';
import sentry from './sentry';

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  loadFonts()
  app
    .use(sentry)
    .use(vuetify)
    .use(router)
    .use(queryPlugin, queryOptions);
}
