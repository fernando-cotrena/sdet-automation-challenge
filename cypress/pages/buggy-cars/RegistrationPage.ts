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
    const form = cy.get('my-register input[formcontrolname]')

    form.get('#username').clear().type(user.username);
    form.get('#firstName').clear().type(user.firstName);
    form.get('#lastName').clear().type(user.lastName);
    form.get('#password').clear().type(user.password);
    form.get('#confirmPassword').clear().type(user.password);

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
