import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - Authentication (Logout)', () => {
  const homePage = new HomePage();
  const registrationPage = new RegistrationPage();

  it('5. Logout: should successfully terminate session and restore unauthenticated UI', () => {
    const user = UserFactory.buildValidUser();

    // 1. Setup dynamic user
    registrationPage
      .visit()
      .fillForm(user)
      .submit()
      .expectSuccessMessage();

    // 2. Log in
    homePage
      .visit()
      .login(user.username, user.password)
      .expectLoggedIn(user.firstName);

    // 3. Logout and assert session ended
    homePage
      .logout()
      .expectLoggedOut();
  });
});
