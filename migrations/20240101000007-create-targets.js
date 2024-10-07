'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'targets',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        stage: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        provider: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        url_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        lambda_arn: {
          type: Sequelize.STRING(110),
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
    await queryInterface.addConstraint('targets', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_targets',
    });

    // Add index on url_id
    await queryInterface.addIndex('targets', ['url_id'], {
      name: 'fk_targets_urls_idx',
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('targets', {
      fields: ['url_id'],
      type: 'foreign key',
      name: 'fk_targets_urls',
      references: {
        table: 'urls',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('targets');
  },
};
