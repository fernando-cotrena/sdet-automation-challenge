import { UserData } from '../factories/UserFactory';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Registers a new user via UI
       */
      registerUser(user: UserData): Chainable<void>;

      /**
       * Logs in using the header login form
       */
      loginByUi(username: string, password: string): Chainable<void>;

      /**
       * Authenticates and caches session using cy.session for independent test execution
       */
      loginWithSession(user: UserData): Chainable<void>;
    }
  }
}

Cypress.Commands.add('registerUser', (user: UserData) => {
  cy.visit('/register');
  cy.get('#username').clear().type(user.username);
  cy.get('#firstName').clear().type(user.firstName);
  cy.get('#lastName').clear().type(user.lastName);
  cy.get('#password').clear().type(user.password);
  cy.get('#confirmPassword').clear().type(user.password);
  cy.get('button[type="submit"].btn-default').click();
  cy.get('.result.alert-success').should('be.visible');
});

Cypress.Commands.add('loginByUi', (username: string, password: string) => {
  cy.get('input[name="login"]').clear().type(username);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('button.btn-success').click();
});

Cypress.Commands.add('loginWithSession', (user: UserData) => {
  cy.session(
    [user.username, user.password],
    () => {
      // First ensure user is registered
      cy.registerUser(user);
      // Then login
      cy.visit('/');
      cy.loginByUi(user.username, user.password);
      cy.contains('span.nav-link', `Hi, ${user.firstName}`).should(
        'be.visible',
      );
    },
    {
      validate() {
        cy.visit('/');
        cy.contains('a.nav-link', 'Logout').should('be.visible');
      },
    },
  );
});

export {};
