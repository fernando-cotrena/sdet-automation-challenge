export abstract class BasePage {
  // Common Navbar Selectors
  protected readonly brandLogo = 'a.navbar-brand';
  protected readonly loginInput = 'input[name="login"]';
  protected readonly passwordInput = 'input[name="password"]';
  protected readonly loginButton = 'button.btn-success';
  protected readonly registerLink = 'a.btn-success-outline[href="/register"], a[href="/register"]';
  protected readonly userGreeting = 'span.nav-link';
  protected readonly logoutLink = 'a.nav-link';
  protected readonly loginErrorMessage = 'span.label-warning';

  /**
   * Navigates to a specific path relative to baseUrl
   */
  public visit(path = '/'): this {
    cy.visit(path);
    return this;
  }

  /**
   * Enters username and password into the header login form and clicks login
   */
  public login(username?: string, password?: string): this {
    if (username) {
      cy.get(this.loginInput).clear().type(username);
    } else {
      cy.get(this.loginInput).clear();
    }

    if (password) {
      cy.get(this.passwordInput).clear().type(password);
    } else {
      cy.get(this.passwordInput).clear();
    }

    cy.get(this.loginButton).click();
    return this;
  }

  /**
   * Clicks logout from the header
   */
  public logout(): this {
    cy.contains(this.logoutLink, 'Logout').should('be.visible').click();
    return this;
  }

  /**
   * Asserts the user is logged in by validating the header greeting
   */
  public expectLoggedIn(name?: string): this {
    if (name) {
      cy.contains(this.userGreeting, `Hi, ${name}`).should('be.visible');
    } else {
      cy.contains(this.userGreeting, 'Hi,').should('be.visible');
    }
    cy.contains(this.logoutLink, 'Logout').should('be.visible');
    return this;
  }

  /**
   * Asserts the session is logged out
   */
  public expectLoggedOut(): this {
    cy.get(this.loginInput).should('be.visible');
    cy.get(this.passwordInput).should('be.visible');
    cy.get(this.loginButton).should('be.visible');
    cy.contains(this.logoutLink, 'Logout').should('not.exist');
    return this;
  }

  /**
   * Asserts login error message in header
   */
  public expectLoginError(message = 'Invalid username/password'): this {
    cy.get(this.loginErrorMessage).should('be.visible').and('contain.text', message);
    return this;
  }
}
