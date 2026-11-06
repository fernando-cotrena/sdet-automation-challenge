export class AuthAsserts {
  private readonly userGreeting = 'span.nav-link';
  private readonly logoutLink = 'a.nav-link';
  private readonly loginInput = 'input[name="login"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'button.btn-success';
  private readonly loginErrorMessage = 'span.label-warning';

  /**
   * Asserts the user is successfully logged in with active session
   */
  public assertLoggedIn(name?: string): this {
    cy.contains(this.userGreeting, `Hi, ${name}`).should('be.visible');
    cy.contains(this.logoutLink, 'Logout').should('be.visible');
    return this;
  }

  /**
   * Asserts that the current session is logged out
   */
  public assertLoggedOut(): this {
    cy.get(this.loginInput).should('be.visible');
    cy.get(this.passwordInput).should('be.visible');
    cy.get(this.loginButton).should('be.visible');
    cy.contains(this.logoutLink, 'Logout').should('not.exist');
    return this;
  }

  /**
   * Asserts error notification when login credentials fail
   */
  public assertLoginError(message = 'Invalid username/password'): this {
    cy.get(this.loginErrorMessage).should('be.visible').and('contain.text', message);
    return this;
  }

  public assertLoginRequired(): this {
  cy.get(this.loginInput)
    .should('have.prop', 'required', true)
    .and('have.prop', 'validity.valid', false);

  return this;
}
}
