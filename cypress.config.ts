import { defineConfig } from 'cypress';

export default defineConfig({
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    baseUrl: 'https://buggy.justtestit.org',
    env: {
      apiBaseUrl: 'https://petstore.swagger.io/v2',
      defaultPassword: 'Password123!',
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'reports/mocha',
      overwrite: false,
      html: false,
      json: true,
    },
    setupNodeEvents(on, config) {
      // Node events listener setup
      return config;
    },
  },
});
