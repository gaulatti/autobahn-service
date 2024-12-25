/** @type {import('sequelize-cli').Migration} */
'use strict';

/**
 * Migration to transform previously BINARY(16) uuid columns into VARCHAR(36),
 * preserving existing data and making them unique.
 *
 * The example shows transformations for these tables:
 *   - projects (uuid)
 *   - targets (uuid)
 *   - schedules (uuid)
 *   - pulses (uuid)
 *   - urls (uuid) [if you want it unique, uncomment the constraint section]
 *
 * If your original constraint names differ, adjust them accordingly.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add temporary columns to store the UUIDs as strings.
     */
    await queryInterface.addColumn('projects', 'uuid_temp', {
      type: Sequelize.STRING(36),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('targets', 'uuid_temp', {
      type: Sequelize.STRING(36),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('schedules', 'uuid_temp', {
      type: Sequelize.STRING(36),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('urls', 'uuid_temp', {
      type: Sequelize.STRING(36),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('pulses', 'uuid_temp', {
      type: Sequelize.STRING(36),
      allowNull: true,
      unique: true,
    });

    /**
     * Copy the UUIDs as strings to the temporary columns.
     */
    await queryInterface.sequelize.query(`
      UPDATE projects
      SET uuid_temp = LOWER(BIN_TO_UUID(uuid))
    `);
    await queryInterface.sequelize.query(`
      UPDATE targets
      SET uuid_temp = LOWER(BIN_TO_UUID(uuid))
    `);
    await queryInterface.sequelize.query(`
      UPDATE schedules
      SET uuid_temp = LOWER(BIN_TO_UUID(uuid))
    `);
    await queryInterface.sequelize.query(`
      UPDATE pulses
      SET uuid_temp = LOWER(BIN_TO_UUID(uuid))
      `);
    await queryInterface.sequelize.query(`
      UPDATE urls
      SET uuid_temp = LOWER(BIN_TO_UUID(uuid))
    `);

    /**
     * Remove the old BINARY(16) columns.
     */
    await queryInterface.removeColumn('projects', 'uuid');
    await queryInterface.removeColumn('targets', 'uuid');
    await queryInterface.removeColumn('schedules', 'uuid');
    await queryInterface.removeColumn('pulses', 'uuid');
    await queryInterface.removeColumn('urls', 'uuid');

    /**
     * Rename the temporary columns to replace the old ones.
     */
    await queryInterface.renameColumn('projects', 'uuid_temp', 'slug');
    await queryInterface.renameColumn('targets', 'uuid_temp', 'slug');
    await queryInterface.renameColumn('schedules', 'uuid_temp', 'slug');
    await queryInterface.renameColumn('pulses', 'uuid_temp', 'slug');
    await queryInterface.renameColumn('urls', 'uuid_temp', 'slug');

    /**
     * Since now, the slugs aren't null.
     */
    await queryInterface.changeColumn('projects', 'slug', {
      type: Sequelize.STRING(36),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('targets', 'slug', {
      type: Sequelize.STRING(36),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('schedules', 'slug', {
      type: Sequelize.STRING(36),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('urls', 'slug', {
      type: Sequelize.STRING(36),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('pulses', 'slug', {
      type: Sequelize.STRING(36),
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add back the original BINARY(16) columns to store UUIDs.
     */
    await queryInterface.addColumn('projects', 'uuid_binary_temp', {
      type: Sequelize.BLOB('binary'),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('targets', 'uuid_binary_temp', {
      type: Sequelize.BLOB('binary'),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('schedules', 'uuid_binary_temp', {
      type: Sequelize.BLOB('binary'),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('urls', 'uuid_binary_temp', {
      type: Sequelize.BLOB('binary'),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('pulses', 'uuid_binary_temp', {
      type: Sequelize.BLOB('binary'),
      allowNull: true,
      unique: true,
    });

    /**
     * Convert UUIDs from strings back to binary and store in temporary columns.
     */
    await queryInterface.sequelize.query(`
      UPDATE projects
      SET uuid_binary_temp = UUID_TO_BIN(slug)
    `);
    await queryInterface.sequelize.query(`
      UPDATE targets
      SET uuid_binary_temp = UUID_TO_BIN(slug)
    `);
    await queryInterface.sequelize.query(`
      UPDATE schedules
      SET uuid_binary_temp = UUID_TO_BIN(slug)
    `);
    await queryInterface.sequelize.query(`
      UPDATE pulses
      SET uuid_binary_temp = UUID_TO_BIN(slug)
    `);
    await queryInterface.sequelize.query(`
      UPDATE urls
      SET uuid_binary_temp = UUID_TO_BIN(slug)
    `);

    /**
     * Remove the current STRING(36) UUID columns.
     */
    await queryInterface.removeColumn('projects', 'slug');
    await queryInterface.removeColumn('targets', 'slug');
    await queryInterface.removeColumn('schedules', 'slug');
    await queryInterface.removeColumn('pulses', 'slug');
    await queryInterface.removeColumn('urls', 'slug');

    /**
     * Rename the temporary binary columns to replace the removed ones.
     */
    await queryInterface.renameColumn('projects', 'uuid_binary_temp', 'uuid');
    await queryInterface.renameColumn('targets', 'uuid_binary_temp', 'uuid');
    await queryInterface.renameColumn('schedules', 'uuid_binary_temp', 'uuid');
    await queryInterface.renameColumn('pulses', 'uuid_binary_temp', 'uuid');
    await queryInterface.renameColumn('urls', 'uuid_binary_temp', 'uuid');

    /**
     * Since now, the UUIDs aren't null.
     */
    await queryInterface.changeColumn('projects', 'uuid', {
      type: Sequelize.BLOB('binary'),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('targets', 'uuid', {
      type: Sequelize.BLOB('binary'),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('schedules', 'uuid', {
      type: Sequelize.BLOB('binary'),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('urls', 'uuid', {
      type: Sequelize.BLOB('binary'),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('pulses', 'uuid', {
      type: Sequelize.BLOB('binary'),
      allowNull: false,
      unique: true,
    });
  },
};
