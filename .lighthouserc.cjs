module.exports = {
  ci: {
    collect: {
      url: ['http://127.0.0.1:3001/'],
      numberOfRuns: 3,
      settings: { chromeFlags: '--no-sandbox --headless=new' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
      },
    },
  },
}
