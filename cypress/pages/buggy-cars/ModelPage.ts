import { BasePage } from './BasePage';

export class ModelPage extends BasePage {
  private readonly votesHeader = 'h4';
  private readonly commentTextarea = '#comment';
  private readonly voteButton = 'button.btn-success';
  private readonly voteSuccessAlert = 'p.card-text';
  private readonly commentsTable = 'table.table tbody';

  public visit(modelPath = '/model/c04b8801-460d-4050-a929-e3ab47a9501d'): this {
    super.visit(modelPath);
    return this;
  }

  /**
   * Retrieves the current votes count as a numeric Cypress Chainable
   */
  public getVotesCount(): Cypress.Chainable<number> {
    return cy.contains(this.votesHeader, 'Votes:').then(($el) => {
      const text = $el.text();
      const match = text.match(/Votes:\s*(\d+)/i);
      const count = match ? parseInt(match[1], 10) : 0;
      return count;
    });
  }

  /**
   * Types a review comment into the model comment box
   */
  public enterComment(comment: string): this {
    cy.get(this.commentTextarea).should('be.visible').clear().type(comment);
    return this;
  }

  /**
   * Clicks the Vote button
   */
  public clickVote(): this {
    cy.contains(this.voteButton, 'Vote!').should('be.enabled').click();
    return this;
  }

  /**
   * Asserts the success message displayed after voting
   */
  public expectVoteSuccess(): this {
    cy.contains(this.voteSuccessAlert, 'Thank you for your vote!').should('be.visible');
    return this;
  }

  /**
   * Asserts that the vote count has increased by 1 from previous count
   */
  public expectVotesIncremented(initialCount: number): this {
    this.getVotesCount().should('eq', initialCount + 1);
    return this;
  }

  /**
   * Asserts that the comment appears in the comments table
   */
  public expectCommentListed(comment: string, author?: string): this {
    cy.get(this.commentsTable).should('be.visible').and('contain.text', comment);
    if (author) {
      cy.get(this.commentsTable).should('contain.text', author);
    }
    return this;
  }
}
