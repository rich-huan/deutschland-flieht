import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      /* Seitenwechsel starten oben; Ankerlinks springen sauber. */
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      /* Weicher Uebergang zwischen den Seiten, wo der Browser ihn kann.
         Wird bei prefers-reduced-motion vom Browser selbst unterdrueckt. */
      withViewTransitions(),
    ),
  ],
};
