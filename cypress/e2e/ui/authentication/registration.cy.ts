import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - User Registration', () => {
  const registrationPage = new RegistrationPage();
  const homePage = new HomePage();

  it('should register a new unique user dynamically and allow subsequent login', () => {
    const newUser = UserFactory.buildValidUser();

    // 1. Visit Registration Page
    registrationPage.visit();

    // 2. Fill form with dynamically generated user data and submit
    registrationPage
      .fillForm(newUser)
      .submit()
      .expectSuccessMessage('Registration is successful');

    // 3. Verify user can immediately log in with the new credentials
    homePage
      .login(newUser.username, newUser.password)
      .expectLoggedIn(newUser.firstName);
  });
});
