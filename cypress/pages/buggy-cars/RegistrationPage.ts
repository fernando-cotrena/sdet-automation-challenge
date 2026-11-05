import { BasePage } from './BasePage';
import { UserData } from '../../factories/UserFactory';

export class RegistrationPage extends BasePage {
  private readonly usernameField = '#username';
  private readonly firstNameField = '#firstName';
  private readonly lastNameField = '#lastName';
  private readonly passwordField = '#password';
  private readonly confirmPasswordField = '#confirmPassword';
  private readonly submitRegisterBtn = 'button[type="submit"].btn-default';

  public visit(): this {
    super.visit('/register');
    return this;
  }

  /**
   * Fills the registration form with user data
   */
  public fillForm(user: UserData): this {
    cy.get(this.usernameField).clear().type(user.username);
    cy.get(this.firstNameField).clear().type(user.firstName);
    cy.get(this.lastNameField).clear().type(user.lastName);
    cy.get(this.passwordField).clear().type(user.password);
    cy.get(this.confirmPasswordField).clear().type(user.password);
    return this;
  }

  /**
   * Submits the registration form
   */
  public submit(): this {
    cy.get(this.submitRegisterBtn).should('be.enabled').click();
    return this;
  }
}
