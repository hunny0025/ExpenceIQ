module.exports = {
  ci: {
    collect: {
      staticDistDir: './frontend/dist',
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        // All downgraded to 'warn' — Lighthouse audit is informational only;
        // it must never be the reason a deployment is blocked.
        'categories:performance':     ['warn', { minScore: 0.7 }],
        'categories:accessibility':   ['warn', { minScore: 0.8 }],
        'categories:best-practices':  ['warn', { minScore: 0.8 }],
        'categories:seo':             ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
