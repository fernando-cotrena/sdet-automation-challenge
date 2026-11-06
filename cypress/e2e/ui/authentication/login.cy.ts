import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { AuthAsserts } from '../../../assertions/buggy-cars/AuthAsserts';
import { RegistrationAsserts } from '../../../assertions/buggy-cars/RegistrationAsserts';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - Authentication (Login)', () => {
  const homePage = new HomePage();
  const registrationPage = new RegistrationPage();
  const authAsserts = new AuthAsserts();
  const registrationAsserts = new RegistrationAsserts();

  it('2. Login exitoso: should log in successfully with newly created user and validate active session', () => {
    const user = UserFactory.buildValidUser();

    // Setup: Dynamically register user
    registrationPage
      .visit()
      .fillForm(user)
      .submit();

    registrationAsserts.assertRegistrationSuccess();

    // Action: Log in
    homePage
      .visit()
      .login(user.username, user.password);

    // Assertion: Validate active session via AuthAsserts
    authAsserts.assertLoggedIn(user.firstName);
  });

  it('3. Login fallido: should display error message when submitting invalid credentials', () => {
    const invalidUser = UserFactory.buildInvalidUser();

    homePage
      .visit()
      .login(invalidUser.username, invalidUser.password);

    authAsserts.assertLoginError('Invalid username/password');
  });

  it('3. Login fallido: should handle empty username and password fields gracefully', () => {
    homePage
      .visit()
      .login('', '');

    authAsserts.assertLoginRequired()
  });
});
