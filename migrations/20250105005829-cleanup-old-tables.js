'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.dropTable('schedules');
    await queryInterface.dropTable('engagement');
    await queryInterface.dropTable('statistics');
  },

  async down() {
    console.log('This migration is not reversible');
  },
};
