'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'urls',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        uuid: {
          type: 'BINARY(16)',
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb3',
      },
    );

    // Add unique constraint on uuid (if required)
    // If uuid should be unique, uncomment the following lines
    /*
    await queryInterface.addConstraint('urls', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_urls',
    });
    */
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('urls');
  },
};
