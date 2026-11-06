import { faker } from '@faker-js/faker';
import { HomePage } from '../../../pages/buggy-cars/HomePage';
import { RegistrationPage } from '../../../pages/buggy-cars/RegistrationPage';
import { ModelPage } from '../../../pages/buggy-cars/ModelPage';
import { AuthAsserts } from '../../../assertions/buggy-cars/AuthAsserts';
import { RegistrationAsserts } from '../../../assertions/buggy-cars/RegistrationAsserts';
import { ModelAsserts } from '../../../assertions/buggy-cars/ModelAsserts';
import { UserFactory } from '../../../factories/UserFactory';

describe('UI - Business Flow (Model Voting & Comments)', () => {
  const homePage = new HomePage();
  const registrationPage = new RegistrationPage();
  const modelPage = new ModelPage();
  const authAsserts = new AuthAsserts();
  const registrationAsserts = new RegistrationAsserts();
  const modelAsserts = new ModelAsserts();

  it('4. Flujo de negocio: should allow an authenticated user to vote for a car with a comment and verify persistence', () => {
    const user = UserFactory.buildValidUser();
    const commentText = `Automation review: ${faker.lorem.sentence()} [${Date.now()}]`;

    // 1. Setup isolated user and log in
    registrationPage.visit().fillForm(user).submit();

    registrationAsserts.assertRegistrationSuccess();

    homePage.visit().login(user.username, user.password);

    authAsserts.assertLoggedIn(user.firstName);

    // 2. Navigate to car model
    homePage.openPopularModel();

    // 3. Capture initial vote count and cast vote with comment
    modelPage.getVotesCount().then((initialVotes) => {
      modelPage.enterComment(commentText).clickVote();

      // Assertions delegated to ModelAsserts layer
      modelAsserts
        .assertVoteSuccess()
        .assertVotesIncremented(initialVotes)
        .assertCommentListed(commentText);
    });
  });
});
