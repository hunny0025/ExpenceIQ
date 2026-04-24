module.exports = {
  ci: {
    collect: {
      staticDistDir: './frontend/dist',
      numberOfRuns: 1,
    },
    assert: {
      // ── Baseline targets set on: 2026-04-25 ──────────────────────────────
      // Targets: FCP < 1.6s, LCP < 2.5s, CLS < 0.1, TBT < 200ms, Score > 85
      // All set to 'warn' so the audit is informational — it never blocks CI.
      assertions: {
        // Category scores (0–1 scale)
        'categories:performance':     ['warn', { minScore: 0.85 }],
        'categories:accessibility':   ['warn', { minScore: 0.85 }],
        'categories:best-practices':  ['warn', { minScore: 0.85 }],
        'categories:seo':             ['warn', { minScore: 0.85 }],

        // Core Web Vitals (in milliseconds / unitless)
        'first-contentful-paint':     ['warn', { maxNumericValue: 1600 }],
        'largest-contentful-paint':   ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time':        ['warn', { maxNumericValue: 200 }],
        'cumulative-layout-shift':    ['warn', { maxNumericValue: 0.1 }],
        'speed-index':                ['warn', { maxNumericValue: 3400 }],
        'interactive':                ['warn', { maxNumericValue: 3800 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
