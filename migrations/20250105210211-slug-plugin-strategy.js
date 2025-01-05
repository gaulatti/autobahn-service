'use strict';

import { nanoid } from 'nanoid';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add a `slug` column to the `playlists` table
   */
  await queryInterface.addColumn('plugins', 'slug', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });

  /**
   * Generate a unique slug for each plugin
   */
  const [plugins] = await queryInterface.sequelize.query(
    'SELECT id FROM plugins',
  );
  for (const plugin of plugins) {
    const slug = nanoid();
    await queryInterface.sequelize.query(
      `UPDATE plugins SET slug = :slug WHERE id = :id`,
      {
        replacements: { slug, id: plugin.id },
      },
    );
  }

  /**
   * Change the `slug` column to be non-nullable
   */
  await queryInterface.changeColumn('plugins', 'slug', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });

  /**
   * Add a `slug` column to the `strategies` table
   */
  await queryInterface.addColumn('strategies', 'slug', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });

  /**
   * Generate a unique slug for each strategy
   */
  const [strategies] = await queryInterface.sequelize.query(
    'SELECT id FROM strategies',
  );
  for (const strategy of strategies) {
    const slug = nanoid();
    await queryInterface.sequelize.query(
      `UPDATE strategies SET slug = :slug WHERE id = :id`,
      {
        replacements: { slug, id: strategy.id },
      },
    );
  }

  /**
   * Change the `slug` column to be non-nullable
   */
  await queryInterface.changeColumn('strategies', 'slug', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });
}

export async function down(queryInterface) {
  /**
   * Remove the `slug` columns
   */
  await queryInterface.removeColumn('plugins', 'slug');
  await queryInterface.removeColumn('strategies', 'slug');
}
