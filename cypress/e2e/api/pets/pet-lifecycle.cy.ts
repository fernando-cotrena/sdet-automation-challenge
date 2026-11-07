import { PetService } from '../../../services/pet/PetService';
import { PetFactory } from '../../../factories/PetFactory';
import {
  PetSchema,
  ApiResponseSchema,
  Pet,
} from '../../../schemas/pet/PetSchema';

describe('API - Pet Lifecycle (/pet)', () => {
  const petService = new PetService();
  const createdPetIds: number[] = [];

  // Guarantee data isolation: Clean up all resources created during tests, even upon failure
  afterEach(() => {
    while (createdPetIds.length > 0) {
      const id = createdPetIds.pop();
      if (id) {
        petService.deletePet(id, false);
      }
    }
  });

  it('1. Alta: should create a new pet with dynamic data and validate contract schema', () => {
    const newPet = PetFactory.build();
    createdPetIds.push(newPet.id);

    petService.createPet(newPet).then((response) => {
      expect(response.status).to.eq(200);

      // Zod contract schema validation
      const parsedPet = PetSchema.parse(response.body);

      // Deep field validations
      expect(parsedPet.id).to.eq(newPet.id);
      expect(parsedPet.name).to.eq(newPet.name);
      expect(parsedPet.status).to.eq(newPet.status);
      expect(parsedPet.category?.name).to.eq(newPet.category?.name);
      expect(parsedPet.photoUrls).to.deep.eq(newPet.photoUrls);
    });
  });

  it('2. Consulta: should fetch an existing pet by ID and match sent data', () => {
    const newPet = PetFactory.build();
    createdPetIds.push(newPet.id);

    // Setup: Create pet first
    petService.createPet(newPet).then(() => {
      // Action: Query by ID
      petService.getPetById(newPet.id).then((response) => {
        expect(response.status).to.eq(200);

        // Zod validation
        const fetchedPet = PetSchema.parse(response.body);

        expect(fetchedPet.id).to.eq(newPet.id);
        expect(fetchedPet.name).to.eq(newPet.name);
        expect(fetchedPet.status).to.eq(newPet.status);
        expect(fetchedPet.category?.name).to.eq(newPet.category?.name);
      });
    });
  });

  it('3. Modificación: should update pet status from available to sold and verify persistence', () => {
    const initialPet = PetFactory.build({ status: 'available' });
    createdPetIds.push(initialPet.id);

    petService.createPet(initialPet).then(() => {
      const updatedPayload: Pet = {
        ...initialPet,
        status: 'sold',
        name: `${initialPet.name}_Sold`,
      };

      // Action: Update pet
      petService.updatePet(updatedPayload).then((putResponse) => {
        expect(putResponse.status).to.eq(200);

        const updatedPet = PetSchema.parse(putResponse.body);
        expect(updatedPet.status).to.eq('sold');
        expect(updatedPet.name).to.eq(updatedPayload.name);

        // Verification: Fetch again and verify the change persisted
        petService.getPetById(initialPet.id).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          const persistedPet = PetSchema.parse(getResponse.body);
          expect(persistedPet.status).to.eq('sold');
          expect(persistedPet.name).to.eq(updatedPayload.name);
        });
      });
    });
  });

  it('4. Baja: should delete pet and verify subsequent query returns 404', () => {
    const petToDelete = PetFactory.build();
    // Do not add to createdPetIds since we explicitly test deletion here

    petService.createPet(petToDelete).then(() => {
      // Action: Delete pet
      petService.deletePet(petToDelete.id).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);

        // Validate API response schema for deletion
        const apiResponse = ApiResponseSchema.parse(deleteResponse.body);
        expect(apiResponse.message).to.eq(String(petToDelete.id));

        // Verification: Subsequent GET must return 404 Not Found
        petService
          .getPetById(petToDelete.id, false)
          .then((notFoundResponse) => {
            expect(notFoundResponse.status).to.eq(404);
          });
      });
    });
  });

  it('5. E2E Complete Lifecycle: should perform create -> get -> update -> delete -> 404 in sequence', () => {
    const pet = PetFactory.build({ status: 'available' });

    // Step 1: Alta
    petService.createPet(pet).then((createRes) => {
      expect(createRes.status).to.eq(200);
      const created = PetSchema.parse(createRes.body);
      expect(created.id).to.eq(pet.id);

      // Step 2: Consulta
      petService.getPetById(pet.id).then((getRes) => {
        expect(getRes.status).to.eq(200);
        expect(PetSchema.parse(getRes.body).name).to.eq(pet.name);

        // Step 3: Modificación
        const modifiedPet: Pet = { ...pet, status: 'sold' };
        petService.updatePet(modifiedPet).then((updateRes) => {
          expect(updateRes.status).to.eq(200);
          expect(PetSchema.parse(updateRes.body).status).to.eq('sold');

          // Step 4: Baja
          petService.deletePet(pet.id).then((deleteRes) => {
            expect(deleteRes.status).to.eq(200);

            // Step 5: Comprobación de no existencia (404)
            petService.getPetById(pet.id, false).then((finalGetRes) => {
              expect(finalGetRes.status).to.eq(404);
            });
          });
        });
      });
    });
  });
});
