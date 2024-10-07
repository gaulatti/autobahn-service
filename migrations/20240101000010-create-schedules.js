'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'schedules',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        targets_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        projects_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        provider: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        cron: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        next_execution: {
          type: Sequelize.DATE,
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
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
        uuid: {
          type: 'BINARY(16)',
          allowNull: false,
          defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb3',
      },
    );

    // Add unique constraint on uuid
    await queryInterface.addConstraint('schedules', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_schedules',
    });

    // Add unique constraint on targets_id and projects_id if required
    await queryInterface.addConstraint('schedules', {
      fields: ['targets_id', 'projects_id'],
      type: 'unique',
      name: 'unique_schedules_targets_projects',
    });

    // Add indexes
    await queryInterface.addIndex('schedules', ['targets_id'], {
      name: 'fk_schedules_targets2_idx',
    });

    await queryInterface.addIndex('schedules', ['projects_id'], {
      name: 'fk_schedules_projects1_idx',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('schedules', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_schedules_targets2',
      references: {
        table: 'targets',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('schedules', {
      fields: ['projects_id'],
      type: 'foreign key',
      name: 'fk_schedules_projects1',
      references: {
        table: 'projects',
        field: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('schedules');
  },
};
