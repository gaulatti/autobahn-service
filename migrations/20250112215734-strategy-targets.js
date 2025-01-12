'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('strategies', 'targets_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('strategies', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_strategies_targets',
      references: {
        table: 'targets',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('strategies', 'targets_id');
  },
};
