import { faker } from '@faker-js/faker';
import { Pet, PetStatus } from '../schemas/pet/PetSchema';

export class PetFactory {
  /**
   * Generates a unique Pet ID using timestamp and random number to prevent collisions
   * in the shared public Petstore environment.
   */
  public static generateUniqueId(): number {
    return Date.now() + faker.number.int({ min: 1000, max: 99999 });
  }

  /**
   * Builds a valid dynamic Pet payload.
   */
  public static build(overrides: Partial<Pet> = {}): Pet {
    const id = overrides.id ?? this.generateUniqueId();

    return {
      id,
      category: {
        id: faker.number.int({ min: 1, max: 100 }),
        name: faker.animal.type(),
      },
      name: `${faker.person.firstName()}_${faker.animal.petName()}`,
      photoUrls: [
        faker.image.url({ width: 640, height: 480 }),
        faker.image.url({ width: 640, height: 480 }),
      ],
      tags: [
        {
          id: faker.number.int({ min: 1, max: 50 }),
          name: faker.word.sample(),
        },
      ],
      status: (overrides.status ?? 'available') as PetStatus,
      ...overrides,
    };
  }

  /**
   * Builds an invalid payload with wrong data types (e.g. string for numeric id, number for status).
   */
  public static buildWithInvalidTypes(): Record<string, unknown> {
    return {
      id: 'invalid-numeric-id-string',
      category: 'invalid-category-should-be-object',
      name: 123456789,
      photoUrls: 'not-an-array',
      status: 9999,
    };
  }
}
