'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'statistics',
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
        provider: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        period: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ttfb: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        fcp: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        dcl: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00',
        },
        lcp: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        tti: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        si: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        cls: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        mode: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        count: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        performance_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        accessibility_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        best_practices_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        seo_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        pleasantness_score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        date_from: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        date_to: {
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
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb3',
      },
    );

    // Add index on targets_id
    await queryInterface.addIndex('statistics', ['targets_id'], {
      name: 'fk_statistics_targets_idx',
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('statistics', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_statistics_targets',
      references: {
        table: 'targets',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('statistics');
  },
};
