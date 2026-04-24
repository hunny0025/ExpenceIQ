module.exports = {
  ci: {
    collect: {
      // Serve the built dist with a real HTTP server so React can boot
      // and Lighthouse can measure an actual FCP (not a blank page).
      startServerCommand: 'npx http-server ./frontend/dist -p 3000 --silent',
      startServerReadyPattern: 'Available on',
      url: ['http://localhost:3000/'],
      numberOfRuns: 1,
      settings: {
        // Run headless without GPU (required in CI)
        chromeFlags: '--no-sandbox --headless --disable-gpu',
      },
    },
    assert: {
      // ── Targets set: FCP < 1.6s, Score > 85 ────────────────────────────
      // All warn — Lighthouse is informational, never blocks deploys.
      assertions: {
        'categories:performance':    ['warn', { minScore: 0.85 }],
        'categories:accessibility':  ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo':            ['warn', { minScore: 0.85 }],
        'first-contentful-paint':    ['warn', { maxNumericValue: 1600 }],
        'largest-contentful-paint':  ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time':       ['warn', { maxNumericValue: 200 }],
        'cumulative-layout-shift':   ['warn', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
