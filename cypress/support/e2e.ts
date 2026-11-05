// ***********************************************************
// Support file loaded automatically before test files.
// ***********************************************************

import './commands';

// Prevent uncaught exceptions from failing tests when third party scripts on the web app throw errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // Buggy Cars site might trigger runtime angularjs errors that don't affect test behavior
  return false;
});
