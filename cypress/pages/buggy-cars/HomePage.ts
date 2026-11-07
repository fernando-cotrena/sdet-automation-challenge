import { BasePage } from './BasePage';
import { RegistrationPage } from './RegistrationPage';
import { ModelPage } from './ModelPage';

export class HomePage extends BasePage {
  private readonly popularModelLink =
    '.col-md-4:nth-child(2) a, a[href*="/model/"]';
  private readonly overallRatingLink =
    '.col-md-4:nth-child(3) a, a[href*="/overall"]';

  public visit(): this {
    super.visit('/');
    return this;
  }

  /**
   * Navigates to the Registration page
   */
  public goToRegistration(): RegistrationPage {
    cy.get(this.registerLink).first().click();
    return new RegistrationPage();
  }

  /**
   * Navigates to the Popular Model page
   */
  public openPopularModel(): ModelPage {
    cy.get(this.popularModelLink).first().click();
    return new ModelPage();
  }

  /**
   * Navigates directly to a specific car model
   */
  public openModel(modelPath: string): ModelPage {
    return new ModelPage().visit(modelPath);
  }
}
