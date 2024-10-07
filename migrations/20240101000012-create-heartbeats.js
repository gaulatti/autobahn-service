'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'heartbeats',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        pulses_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        retries: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ttfb: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        fcp: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        dcl: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        lcp: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        tti: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        si: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        cls: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        screenshots: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: null,
        },
        mode: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        performance_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        accessibility_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        seo_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        best_practices_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.INTEGER,
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
        ended_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
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

    // Add index on pulses_id
    await queryInterface.addIndex('heartbeats', ['pulses_id'], {
      name: 'fk_heartbeats_pulses1_idx',
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('heartbeats', {
      fields: ['pulses_id'],
      type: 'foreign key',
      name: 'fk_heartbeats_pulses1',
      references: {
        table: 'pulses',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('heartbeats');
  },
};
