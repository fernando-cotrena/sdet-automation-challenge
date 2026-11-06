import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://buggy.justtestit.org',
    env: {
      apiBaseUrl: process.env.CYPRESS_API_BASE_URL || 'https://petstore.swagger.io/v2',
      environment: process.env.CYPRESS_ENV || 'QA',
      defaultPassword: 'Password123!'
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: process.env.CI ? true : false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'reports/mocha',
      overwrite: false,
      html: false,
      json: true
    },
    setupNodeEvents(on, config) {
      // Node events listener setup
      return config;
    }
  }
});
