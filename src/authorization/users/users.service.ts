import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Membership } from 'src/models/membership.model';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly user: typeof User) {}

  /**
   * Retrieves a user by their subject identifier (sub).
   *
   * @param {string} sub - The subject identifier of the user.
   * @returns {Promise<User>} A promise that resolves to the user object.
   */
  async getUser(sub: string): Promise<User> {
    return await this.user.findOne({ where: { sub } });
  }

  /**
   * Finds a user by their ID.
   *
   * @param {number} id - The ID of the user to find.
   * @returns {Promise<User>} A promise that resolves to the user with the specified ID.
   */
  async findUser(id: number): Promise<User> {
    return await this.user.findOne({ where: { id }, include: [Membership] });
  }

  async updateUser(payload: {
    sub: string;
    given_name: string;
    family_name: string;
    email: string;
  }): Promise<User> {
    const { sub, given_name: name, family_name, email } = payload;

    /**
     * Retrieve the user by their subject identifier (sub).
     * If the user does not exist, create a new user.
     */
    const user =
      (await this.getUser(sub)) ||
      (await this.user.create({ sub, name, last_name: family_name, email }));

    /**
     * If the user does not have the required fields, update them.
     */
    if (
      user.name !== name ||
      user.last_name !== family_name ||
      user.email !== email
    ) {
      return user.update({
        name,
        last_name: family_name,
        email,
        lastAccess: new Date(),
      });
    } else {
      return user.update({
        lastAccess: new Date(),
      });
    }
  }
}
