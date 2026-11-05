import { faker } from '@faker-js/faker';
import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { ModelPage } from '../../../pages/buggy-cars/ModelPage';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - Business Flow (Model Voting & Comments)', () => {
  const homePage = new HomePage();
  const registrationPage = new RegistrationPage();
  const modelPage = new ModelPage();

  it('4. Flujo de negocio: should allow an authenticated user to vote for a car with a comment and verify persistence', () => {
    const user = UserFactory.buildValidUser();
    const commentText = `Automation review: ${faker.lorem.sentence()} [${Date.now()}]`;

    // 1. Setup isolated user and log in
    registrationPage
      .visit()
      .fillForm(user)
      .submit()
      .expectSuccessMessage();

    homePage
      .visit()
      .login(user.username, user.password)
      .expectLoggedIn(user.firstName);

    // 2. Navigate to car model (via Popular Model card on Home)
    homePage.openPopularModel();

    // 3. Capture initial vote count and cast vote with comment
    modelPage.getVotesCount().then((initialVotes) => {
      modelPage
        .enterComment(commentText)
        .clickVote()
        .expectVoteSuccess()
        .expectVotesIncremented(initialVotes)
        .expectCommentListed(commentText, user.firstName);
    });
  });
});
