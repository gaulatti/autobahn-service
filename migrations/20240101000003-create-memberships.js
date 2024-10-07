'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'memberships',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        users_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        teams_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        role: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb3',
      },
    );

    // Add unique constraint on users_id and teams_id
    await queryInterface.addConstraint('memberships', {
      fields: ['users_id', 'teams_id'],
      type: 'unique',
      name: 'unique_memberships_users_teams',
    });

    // Add indexes
    await queryInterface.addIndex('memberships', ['users_id'], {
      name: 'fk_memberships_users1_idx',
    });

    await queryInterface.addIndex('memberships', ['teams_id'], {
      name: 'fk_memberships_teams1_idx',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('memberships', {
      fields: ['users_id'],
      type: 'foreign key',
      name: 'fk_memberships_users1',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('memberships', {
      fields: ['teams_id'],
      type: 'foreign key',
      name: 'fk_memberships_teams1',
      references: {
        table: 'teams',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('memberships');
  },
};
