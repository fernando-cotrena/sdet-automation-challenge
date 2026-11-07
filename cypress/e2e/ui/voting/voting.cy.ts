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

  let user: ReturnType<typeof UserFactory.buildValidUser>;

  beforeEach(() => {
    user = UserFactory.buildValidUser();

    // Setup: Register and authenticate a new user
    registrationPage.visit().fillForm(user).submit();

    registrationAsserts.assertRegistrationSuccess();

    homePage.visit().login(user.username, user.password);

    authAsserts.assertLoggedIn(user.firstName);
  });

  it('4. should allow an authenticated user to vote for a car with a comment and verify persistence', () => {
    const commentText = `Automation review: ${faker.lorem.sentence()} [${Date.now()}]`;

    // Navigate to car model
    homePage.openPopularModel();

    // Capture initial vote count and cast vote
    modelPage.getVotesCount().then((initialVotes) => {
      modelPage.enterComment(commentText).clickVote();

      modelAsserts
        .assertVoteSuccess()
        .assertVotesIncremented(initialVotes)
        .assertCommentListed(commentText);
    });
  });
});
