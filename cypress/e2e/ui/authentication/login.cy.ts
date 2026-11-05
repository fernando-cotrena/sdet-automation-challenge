import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - Authentication (Login)', () => {
  const homePage = new HomePage();
  const registrationPage = new RegistrationPage();

  it('2. Login exitoso: should log in successfully with newly created user and validate active session', () => {
    const user = UserFactory.buildValidUser();

    // Setup: Dynamically register the user first to ensure test isolation
    registrationPage
      .visit()
      .fillForm(user)
      .submit()
      .expectSuccessMessage();

    // Action: Log in with newly registered credentials
    homePage
      .visit()
      .login(user.username, user.password)
      .expectLoggedIn(user.firstName);
  });

  it('3. Login fallido: should display error message when submitting invalid credentials', () => {
    const invalidUser = UserFactory.buildInvalidUser();

    homePage
      .visit()
      .login(invalidUser.username, invalidUser.password)
      .expectLoginError('Invalid username/password');
  });

  it('3. Login fallido: should handle empty username and password fields gracefully', () => {
    homePage
      .visit()
      .login('', '')
      .expectLoginError('Invalid username/password');
  });
});
