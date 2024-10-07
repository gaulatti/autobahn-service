'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'pulses',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        targets_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        url_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        triggered_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        stage: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        provider: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        schedules_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
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
    await queryInterface.addConstraint('pulses', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_pulses',
    });

    // Add indexes
    await queryInterface.addIndex('pulses', ['targets_id'], {
      name: 'fk_pulses_targets1_idx',
    });

    await queryInterface.addIndex('pulses', ['triggered_by'], {
      name: 'fk_pulses_memberships1_idx',
    });

    await queryInterface.addIndex('pulses', ['url_id'], {
      name: 'fk_pulses_urls_idx',
    });

    await queryInterface.addIndex('pulses', ['schedules_id'], {
      name: 'fk_pulses_schedules_idx',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('pulses', {
      fields: ['triggered_by'],
      type: 'foreign key',
      name: 'fk_pulses_memberships1',
      references: {
        table: 'memberships',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('pulses', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_pulses_targets1',
      references: {
        table: 'targets',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('pulses', {
      fields: ['schedules_id'],
      type: 'foreign key',
      name: 'fk_pulses_schedules',
      references: {
        table: 'schedules',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('pulses', {
      fields: ['url_id'],
      type: 'foreign key',
      name: 'fk_pulses_urls',
      references: {
        table: 'urls',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('pulses');
  },
};
