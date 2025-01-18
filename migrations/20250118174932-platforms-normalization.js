'use strict';

import { nanoid } from 'nanoid';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Create the `platforms` table
   */
  await queryInterface.createTable('platforms', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('desktop', 'mobile'),
      allowNull: false,
    },
    user_agent: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });

  /**
   * Create mobile and desktop records for backward compatibility
   */
  const userAgents = [
    {
      type: 'desktop',
      user_agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      slug: nanoid(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      type: 'mobile',
      slug: nanoid(),
      user_agent:
        'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await queryInterface.bulkInsert('platforms', userAgents);

  /**
   * Add the `platforms_id` column to the `heartbeats` table
   */
  await queryInterface.addColumn('heartbeats', 'platforms_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
  });

  /**
   * Add a foreign key constraint to the `platforms_id` column
   */
  await queryInterface.addConstraint('heartbeats', {
    fields: ['platforms_id'],
    type: 'foreign key',
    name: 'fk_heartbeats_platforms',
    references: {
      table: 'platforms',
      field: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });

  /**
   * Migrate the data from the `mode` column to the `platforms_id` column
   */
  await queryInterface.sequelize.query(`
      UPDATE heartbeats
      SET platforms_id = CASE
        WHEN mode = 0 THEN 2
        WHEN mode = 1 THEN 1
      END
    `);

  /**
   * Remove the `mode` column from the `heartbeats` table
   */
  await queryInterface.removeColumn('heartbeats', 'mode');
}
export async function down() {
  console.log('This migration is not reversible');
}
