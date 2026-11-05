import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { AuthAsserts } from '../../../assertions/buggy-cars/AuthAsserts';
import { RegistrationAsserts } from '../../../assertions/buggy-cars/RegistrationAsserts';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - Authentication (Logout)', () => {
  const homePage = new HomePage();
  const registrationPage = new RegistrationPage();
  const authAsserts = new AuthAsserts();
  const registrationAsserts = new RegistrationAsserts();

  it('5. Logout: should successfully terminate session and restore unauthenticated UI', () => {
    const user = UserFactory.buildValidUser();

    // 1. Setup dynamic user
    registrationPage
      .visit()
      .fillForm(user)
      .submit();

    registrationAsserts.assertRegistrationSuccess();

    // 2. Log in
    homePage
      .visit()
      .login(user.username, user.password);

    authAsserts.assertLoggedIn(user.firstName);

    // 3. Logout
    homePage.logout();

    // 4. Assert session ended via AuthAsserts
    authAsserts.assertLoggedOut();
  });
});
