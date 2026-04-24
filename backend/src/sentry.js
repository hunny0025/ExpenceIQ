/**
 * Sentry Backend Initialisation — CommonJS version
 *
 * Must be required at the very top of server.js — before any other requires —
 * so Sentry can instrument all modules including Express.
 *
 * DSN is injected via SENTRY_DSN env var.
 * If not set (local dev / CI) Sentry is a no-op.
 */
const Sentry = require('@sentry/node');

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'production',

    // 100% traces in staging/dev; 10% in production to keep costs down
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Do NOT send user PII (emails, IPs) to Sentry
    sendDefaultPii: false,
  });

  console.log(`[Sentry] Initialised — env: ${process.env.NODE_ENV ?? 'production'}`);
} else {
  console.log('[Sentry] SENTRY_DSN not set — error reporting disabled (safe for dev/CI)');
}

module.exports = Sentry;
