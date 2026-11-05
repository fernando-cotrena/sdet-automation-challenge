import { ModelPage } from '../../pages/buggy-cars/ModelPage';

export class ModelAsserts {
  private readonly voteSuccessAlert = 'p.card-text';
  private readonly commentsTable = 'table.table tbody';
  private readonly modelPage = new ModelPage();

  /**
   * Asserts the success notification displayed after submitting a vote
   */
  public assertVoteSuccess(expectedText = 'Thank you for your vote!'): this {
    cy.contains(this.voteSuccessAlert, expectedText).should('be.visible');
    return this;
  }

  /**
   * Asserts that the vote count has incremented by 1 compared to initial count
   */
  public assertVotesIncremented(initialCount: number): this {
    this.modelPage.getVotesCount().should('eq', initialCount + 1);
    return this;
  }

  /**
   * Asserts that the comment and author are recorded in the comments table
   */
  public assertCommentListed(commentText: string, author?: string): this {
    cy.get(this.commentsTable).should('be.visible').and('contain.text', commentText);
    if (author) {
      cy.get(this.commentsTable).should('contain.text', author);
    }
    return this;
  }
}
