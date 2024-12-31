'use strict';

import { nanoid } from 'nanoid';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.bulkInsert('teams', [
    {
      id: 1,

      /**
       * Rename as needed.
       */
      name: 'Gaulatti',
      created_at: new Date('2024-12-30 02:58:38'),
      updated_at: new Date('2024-12-30 02:58:38'),
      deleted_at: null,
    },
  ]);

  await queryInterface.bulkInsert('memberships', [
    {
      id: 1,
      users_id: 1,
      teams_id: 1,
      role: 0,
    },
  ]);

  await queryInterface.bulkInsert('plugins', [
    {
      id: 1,
      teams_id: 1,
      name: 'Hardcoded Source',
      description: 'NoOp. The url will be hydrated into the playlist.',
      arn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:function:NoOpFunction`,
      plugin_type: 'SOURCE',
      plugin_key: nanoid(),
      created_at: new Date('2024-11-25 22:36:55'),
      updated_at: new Date('2024-11-25 22:36:55'),
    },
    {
      id: 2,
      teams_id: 1,
      name: 'Autobahn Storage',
      arn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:function:AutobahnAutobahnStoragePlugin`,
      description: 'It stores the playlist results in the Autobahn database.',
      plugin_type: 'DELIVERY',
      plugin_key: nanoid(),
      created_at: new Date('2024-11-25 22:36:55'),
      updated_at: new Date('2024-11-25 22:36:55'),
    },
    {
      id: 3,
      teams_id: 1,
      name: 'Autobahn Lighthouse Provider',
      arn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:function:AutobahnInternalLighthouseProviderPlugin`,
      description: 'It invokes Lighthouse to get the results.',
      plugin_type: 'PROVIDER',
      plugin_key: nanoid(),
      created_at: new Date('2024-11-25 22:36:55'),
      updated_at: new Date('2024-11-25 22:36:55'),
    },
  ]);

  await queryInterface.bulkInsert('projects', [
    {
      id: 1,
      teams_id: 1,
      name: 'Autobahn Ad-Hoc',
      slug: nanoid(),
    },
  ]);

  await queryInterface.bulkInsert('strategies', [
    {
      id: 1,
      projects_id: 1,
      name: 'Autobahn Ad-Hoc',
      description: 'It runs Lighthouse in arcade mode.',
      stage: 'PROD',
    },
  ]);

  await queryInterface.bulkInsert('slots', [
    {
      strategies_id: 1,
      plugins_id: 1,
      order: 1,
      metadata: '{}',
      min_outputs: 0,
    },
    {
      strategies_id: 1,
      plugins_id: 3,
      order: 2,
      metadata: '{}',
      min_outputs: 2,
    },
    {
      strategies_id: 1,
      plugins_id: 2,
      order: 3,
      metadata: '{}',
      min_outputs: 0,
    },
  ]);
}
export async function down(queryInterface) {
  await queryInterface.bulkDelete('slots');
  await queryInterface.bulkDelete('strategies');
  await queryInterface.bulkDelete('projects');
  await queryInterface.bulkDelete('plugins');
  await queryInterface.bulkDelete('memberships');
  await queryInterface.bulkDelete('teams');
}
