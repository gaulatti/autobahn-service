'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Remove the foreign key and index from targets
     */
    await queryInterface.removeConstraint('targets', 'fk_targets_urls');
    await queryInterface.removeIndex('targets', 'fk_targets_urls_idx');

    /**
     * Create a join table to store the many-to-many relationship between targets and urls
     */
    await queryInterface.createTable('target_urls', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      targets_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      urls_id: {
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
    });

    /**
     * Add Indexes
     */
    await queryInterface.addIndex('target_urls', ['targets_id'], {
      name: 'fk_target_urls_targets_idx',
    });

    await queryInterface.addIndex('target_urls', ['urls_id'], {
      name: 'fk_target_urls_urls_idx',
    });

    /**
     * Add a unique constraint to the join
     */
    await queryInterface.addConstraint('target_urls', {
      fields: ['targets_id', 'urls_id'],
      type: 'unique',
      name: 'unique_targets_urls',
    });

    /**
     * Add foreign keys to the join table
     */
    await queryInterface.addConstraint('target_urls', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_target_urls_targets',
      references: {
        table: 'targets',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('target_urls', {
      fields: ['urls_id'],
      type: 'foreign key',
      name: 'fk_target_urls_urls',
      references: {
        table: 'urls',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    /**
     * Move the data from targets.url_id to target_urls
     */
    const targets = await queryInterface.sequelize.query(
      `SELECT id AS targets_id, url_id AS urls_id FROM targets WHERE url_id IS NOT NULL`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (targets.length > 0) {
      const targetUrlsData = targets.map((record) => ({
        targets_id: record.targets_id,
        urls_id: record.urls_id,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await queryInterface.bulkInsert('target_urls', targetUrlsData);
    }

    /**
     * Remove the url_id column from targets
     */
    await queryInterface.removeColumn('targets', 'url_id');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add the url_id column back to targets
     */
    await queryInterface.addColumn('targets', 'url_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    /**
     * Move the data from target_urls back to targets.url_id
     */
    const targetUrls = await queryInterface.sequelize.query(
      `SELECT targets_id, urls_id FROM target_urls`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    for (const record of targetUrls) {
      await queryInterface.sequelize.query(
        `UPDATE targets SET url_id = ${record.urls_id} WHERE id = ${record.targets_id}`,
      );
    }

    /**
     * Drop the target
     */
    await queryInterface.dropTable('target_urls');

    /**
     * Add the foreign key and index back to targets
     */
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

    /**
     * Add the index back to targets
     */
    await queryInterface.addIndex('targets', ['url_id'], {
      name: 'fk_targets_urls_idx',
    });
  },
};
