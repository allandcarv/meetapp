import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import User from '../app/models/User';

const models = [File, Meetup, User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
