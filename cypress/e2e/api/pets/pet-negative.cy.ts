import { PetService } from '../../../services/pet/PetService';
import { PetFactory } from '../../../factories/PetFactory';
import { ApiResponseSchema } from '../../../schemas/pet/PetSchema';

describe('API - Pet Negative Scenarios (/pet)', () => {
  const petService = new PetService();

  it('Negative 1: should return 404 when querying a non-existent pet ID', () => {
    // Generate an ID that does not exist in Petstore
    const nonExistentId = 999999999999990;

    petService.getPetById(nonExistentId, false).then((response) => {
      expect(response.status).to.eq(404);

      // Swagger response body validation for 404
      const errorBody = ApiResponseSchema.parse(response.body);
      expect(errorBody.message?.toLowerCase()).to.include('pet not found');
    });
  });

  it('Negative 2: should return 404 when deleting a non-existent pet ID', () => {
    const nonExistentId = 999999999999991;

    petService.deletePet(nonExistentId, false).then((response) => {
      // Petstore returns 404 when attempting to delete an unknown ID
      expect(response.status).to.eq(404);
    });
  });

  it('Negative 3: should handle invalid payload types gracefully', () => {
    const invalidPayload = PetFactory.buildWithInvalidTypes();

    /**
     * Finding / Hallazgo:
     * Swagger documentation specifies 405 (Invalid input) for POST /pet.
     * However, in the public Swagger Petstore v2 implementation, sending malformed types
     * (e.g. non-numeric id or wrong data structures) typically returns 500 or 400
     * due to underlying Java deserialization exceptions (NumberFormatException).
     * We assert the server rejects the request with an error status (400 or 500) rather than accepting it.
     */
    petService.createPet(invalidPayload, false).then((response) => {
      expect(response.status).to.be.oneOf([400, 405, 500]);
      expect(response.status).to.not.eq(200);
    });
  });

  it('Negative 4: should reject query with invalid ID format (non-numeric string)', () => {
    const invalidFormatId = 'not-a-valid-numeric-id';

    /**
     * Finding / Hallazgo:
     * Swagger documentation specifies 400 for 'Invalid ID supplied'.
     * In Petstore v2, non-integer path parameters are rejected with 404 (route match failure)
     * or 400 (type conversion error). We validate that the request is properly rejected.
     */
    petService.getPetById(invalidFormatId, false).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });
});
