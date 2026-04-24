import * as Sentry from '@sentry/react';

/**
 * Sentry Frontend Initialisation
 *
 * DSN is injected via VITE_SENTRY_DSN environment variable.
 * In development (no DSN set) Sentry is a no-op — no errors are reported.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    // Silently skip in local dev — avoids noisy console warnings
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_ENV ?? 'production',

    // Capture 100 % of traces in staging/dev; reduce in production
    tracesSampleRate: import.meta.env.VITE_ENV === 'production' ? 0.2 : 1.0,

    // Replay 10 % of sessions; 100 % on error sessions
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
  });
}

export { Sentry };
