import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {}

  async getUsers() {
    const [response] = await this.sequelize.query('SELECT * FROM users');
    return response;
  }
}
