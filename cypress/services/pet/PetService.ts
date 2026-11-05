import { Pet } from '../schemas/pet/PetSchema';

export class PetService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = Cypress.env('apiBaseUrl') || 'https://petstore.swagger.io/v2';
  }

  /**
   * Creates a new pet (POST /pet)
   */
  public createPet(payload: Pet | Record<string, unknown>, failOnStatusCode = true) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/pet`,
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode
    });
  }

  /**
   * Retrieves a pet by its ID (GET /pet/{id})
   */
  public getPetById(id: number | string, failOnStatusCode = true) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/pet/${id}`,
      failOnStatusCode
    });
  }

  /**
   * Updates an existing pet (PUT /pet)
   */
  public updatePet(payload: Pet | Record<string, unknown>, failOnStatusCode = true) {
    return cy.request({
      method: 'PUT',
      url: `${this.baseUrl}/pet`,
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode
    });
  }

  /**
   * Deletes a pet by ID (DELETE /pet/{id})
   */
  public deletePet(id: number | string, failOnStatusCode = true) {
    return cy.request({
      method: 'DELETE',
      url: `${this.baseUrl}/pet/${id}`,
      headers: {
        api_key: 'special-key'
      },
      failOnStatusCode
    });
  }
}
