'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'baselines',
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
        mode: {
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

    // Add unique constraint on id and targets_id (if required)
    // Alternatively, you can add a unique constraint on targets_id if each target has one baseline
    // For now, we'll assume targets_id should be unique

    await queryInterface.addConstraint('baselines', {
      fields: ['targets_id'],
      type: 'unique',
      name: 'unique_baselines_targets_id',
    });

    // Add index on targets_id
    await queryInterface.addIndex('baselines', ['targets_id'], {
      name: 'fk_baselines_targets_idx',
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('baselines', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_baselines_targets',
      references: {
        table: 'targets',
        field: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('baselines');
  },
};
