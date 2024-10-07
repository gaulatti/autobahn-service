'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'projects',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        teams_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        uuid: {
          type: 'BINARY(16)',
          allowNull: false,
          defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
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
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb3',
      },
    );

    // Add unique constraint on uuid
    await queryInterface.addConstraint('projects', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_projects',
    });

    // Add index on teams_id
    await queryInterface.addIndex('projects', ['teams_id'], {
      name: 'fk_projects_teams2_idx',
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('projects', {
      fields: ['teams_id'],
      type: 'foreign key',
      name: 'fk_projects_teams2',
      references: {
        table: 'teams',
        field: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('projects');
  },
};
