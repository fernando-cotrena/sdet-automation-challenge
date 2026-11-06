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
    const form = cy.get('form').filter(':has(#firstName)');

    form.find('#username').clear().type(user.username);
    form.find('#firstName').clear().type(user.firstName);
    form.find('#lastName').clear().type(user.lastName);
    form.find('#password').clear().type(user.password);
    form.find('#confirmPassword').clear().type(user.password);

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
