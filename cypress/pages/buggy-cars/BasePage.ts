export abstract class BasePage {
  // Common Navbar Locators
  protected readonly brandLogo = 'a.navbar-brand';
  protected readonly loginInput = 'input[name="login"]';
  protected readonly passwordInput = 'nav.navbar my-login input[name="password"]';
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
}
