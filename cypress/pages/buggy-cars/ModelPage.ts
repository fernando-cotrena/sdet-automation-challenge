import { BasePage } from './BasePage';

export class ModelPage extends BasePage {
  private readonly votesHeader = 'h4';
  private readonly commentTextarea = '#comment';
  private readonly voteButton = 'button.btn-success';

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
}
