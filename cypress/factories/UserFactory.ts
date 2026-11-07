import { faker } from '@faker-js/faker';

export interface UserData {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class UserFactory {
  /**
   * Generates a unique, valid user meeting Buggy Cars Rating requirements:
   * - Alphanumeric username (min 3 chars)
   * - Complex password (uppercase, lowercase, number, symbol, min 6 chars)
   */
  public static buildValidUser(overrides: Partial<UserData> = {}): UserData {
    const timestamp = Date.now();
    const randomSuffix = faker.string.alphanumeric({
      length: 5,
      casing: 'lower',
    });
    const username = `test_${timestamp}_${randomSuffix}`;
    const firstName =
      faker.person.firstName().replace(/[^a-zA-Z]/g, '') || 'John';
    const lastName = faker.person.lastName().replace(/[^a-zA-Z]/g, '') || 'Doe';
    // Buggy Cars password rules: at least 1 uppercase, 1 lowercase, 1 number, 1 special character
    const password = overrides.password ?? 'P@ssword123!';

    return {
      username: overrides.username ?? username,
      firstName: overrides.firstName ?? firstName,
      lastName: overrides.lastName ?? lastName,
      password,
    };
  }

  /**
   * Builds an invalid user payload for negative authentication tests.
   */
  public static buildInvalidUser(): UserData {
    return {
      username: `nonexistent_${Date.now()}`,
      firstName: 'Invalid',
      lastName: 'User',
      password: 'WrongPassword123!',
    };
  }
}
