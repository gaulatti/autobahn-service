'use strict';

import { nanoid } from 'nanoid';

export async function up(queryInterface, Sequelize) {
  /**
   * Add a `slug` column to the `playlists` table
   */
  await queryInterface.addColumn('playlists', 'slug', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });

  /**
   * Generate a unique slug for each playlist
   */
  const [playlists] = await queryInterface.sequelize.query(
    'SELECT id FROM playlists',
  );
  for (const playlist of playlists) {
    const slug = nanoid();
    await queryInterface.sequelize.query(
      `UPDATE playlists SET slug = :slug WHERE id = :id`,
      {
        replacements: { slug, id: playlist.id },
      },
    );
  }

  /**
   * Change the `slug` column to be non-nullable
   */
  await queryInterface.changeColumn('playlists', 'slug', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });
}

export async function down(queryInterface) {
  /**
   * Remove the `slug` column
   */
  await queryInterface.removeColumn('playlists', 'slug');
}
