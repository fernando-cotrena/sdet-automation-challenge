import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { RegistrationAsserts } from '../../../assertions/buggy-cars/RegistrationAsserts';
import { AuthAsserts } from '../../../assertions/buggy-cars/AuthAsserts';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - User Registration', () => {
  const registrationPage = new RegistrationPage();
  const registrationAsserts = new RegistrationAsserts();
  const homePage = new HomePage();
  const authAsserts = new AuthAsserts();

  it('should register a new unique user dynamically and allow subsequent login', () => {
    const newUser = UserFactory.buildValidUser();

    // 1. Visit Registration Page
    registrationPage.visit();

    // 2. Fill form with dynamically generated user data and submit
    registrationPage.fillForm(newUser).submit();

    // Assert registration success via dedicated assertion layer
    registrationAsserts.assertRegistrationSuccess('Registration is successful');

    // 3. Verify user can immediately log in with the new credentials
    homePage.login(newUser.username, newUser.password);
    authAsserts.assertLoggedIn(newUser.firstName);
  });
});
