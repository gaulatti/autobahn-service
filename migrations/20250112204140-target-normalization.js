'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    /**
     * Cleanup Targets
     */
    await queryInterface.removeColumn('targets', 'stage');
    await queryInterface.removeColumn('targets', 'lambda_arn');
    await queryInterface.removeColumn('targets', 'provider');

    /**
     * Migrate existing targets from Pulses to target_urls
     */
    await queryInterface.sequelize.query(
      `INSERT INTO target_urls (targets_id, urls_id, created_at, updated_at)
       SELECT DISTINCT p.targets_id, p.url_id, NOW(), NOW()
       FROM pulses p
       LEFT JOIN target_urls tu
           ON p.targets_id = tu.targets_id AND p.url_id = tu.urls_id
       WHERE p.targets_id IS NOT NULL
         AND p.url_id IS NOT NULL
         AND tu.targets_id IS NULL`,
    );

    /**
     * Remove targets_id from Pulses
     */
    await queryInterface.removeColumn('pulses', 'targets_id');
  },

  async down() {
    console.log('This migration is not reversible');
  },
};
