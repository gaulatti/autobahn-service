'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'engagement',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        url_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        bounce_rate: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        mode: {
          type: Sequelize.INTEGER,
          allowNull: false,
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

    // Add index on url_id
    await queryInterface.addIndex('engagement', ['url_id'], {
      name: 'fk_engagement_urls_idx',
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('engagement', {
      fields: ['url_id'],
      type: 'foreign key',
      name: 'fk_engagement_urls',
      references: {
        table: 'urls',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('engagement');
  },
};
