export class RegistrationAsserts {
  private readonly alertResult = '.result';

  /**
   * Asserts registration succeeded with confirmation banner
   */
  public assertRegistrationSuccess(
    expectedText = 'Registration is successful',
  ): this {
    cy.get(this.alertResult)
      .should('be.visible')
      .and('have.class', 'alert-success')
      .and('contain.text', expectedText);
    return this;
  }

  /**
   * Asserts registration failed with error banner
   */
  public assertRegistrationError(expectedText: string): this {
    cy.get(this.alertResult)
      .should('be.visible')
      .and('have.class', 'alert-danger')
      .and('contain.text', expectedText);
    return this;
  }
}
