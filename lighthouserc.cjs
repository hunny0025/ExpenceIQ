module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx serve -s ./frontend/dist -p 4711',
      url: ['http://localhost:4711/'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu --headless',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.75 }],
        'categories:best-practices': ['warn', { minScore: 0.75 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
