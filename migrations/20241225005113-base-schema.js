'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
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
    });

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sub: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
    });

    await queryInterface.addConstraint('users', {
      fields: ['sub'],
      type: 'unique',
      name: 'unique_sub_constraint',
    });

    await queryInterface.createTable('memberships', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      teams_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('memberships', {
      fields: ['users_id', 'teams_id'],
      type: 'unique',
      name: 'unique_memberships_users_teams',
    });

    await queryInterface.addIndex('memberships', ['users_id'], {
      name: 'fk_memberships_users1_idx',
    });
    await queryInterface.addIndex('memberships', ['teams_id'], {
      name: 'fk_memberships_teams1_idx',
    });

    await queryInterface.addConstraint('memberships', {
      fields: ['users_id'],
      type: 'foreign key',
      name: 'fk_memberships_users1',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('memberships', {
      fields: ['teams_id'],
      type: 'foreign key',
      name: 'fk_memberships_teams1',
      references: {
        table: 'teams',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teams_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      uuid: {
        type: 'BINARY(16)',
        allowNull: false,
        defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
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
    });

    await queryInterface.addConstraint('projects', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_projects',
    });

    await queryInterface.addIndex('projects', ['teams_id'], {
      name: 'fk_projects_teams2_idx',
    });

    await queryInterface.addConstraint('projects', {
      fields: ['teams_id'],
      type: 'foreign key',
      name: 'fk_projects_teams2',
      references: {
        table: 'teams',
        field: 'id',
      },
    });

    await queryInterface.createTable('assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projects_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      memberships_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('assignments', {
      fields: ['projects_id', 'memberships_id'],
      type: 'unique',
      name: 'unique_assignments_projects_memberships',
    });

    await queryInterface.addIndex('assignments', ['projects_id'], {
      name: 'fk_assignments_projects1_idx',
    });
    await queryInterface.addIndex('assignments', ['memberships_id'], {
      name: 'fk_assignments_memberships1_idx',
    });

    await queryInterface.addConstraint('assignments', {
      fields: ['projects_id'],
      type: 'foreign key',
      name: 'fk_assignments_projects1',
      references: {
        table: 'projects',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('assignments', {
      fields: ['memberships_id'],
      type: 'foreign key',
      name: 'fk_assignments_memberships1',
      references: {
        table: 'memberships',
        field: 'id',
      },
    });

    await queryInterface.createTable('urls', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: Sequelize.TEXT,
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
      uuid: {
        type: 'BINARY(16)',
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.createTable('targets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stage: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      provider: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      url_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lambda_arn: {
        type: Sequelize.STRING(110),
        allowNull: true,
        defaultValue: null,
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
      uuid: {
        type: 'BINARY(16)',
        allowNull: false,
        defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
      },
    });

    await queryInterface.addConstraint('targets', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_targets',
    });

    await queryInterface.addIndex('targets', ['url_id'], {
      name: 'fk_targets_urls_idx',
    });

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

    await queryInterface.createTable('baselines', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      targets_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ttfb: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      fcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      dcl: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      lcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      tti: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      si: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      cls: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      mode: {
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
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.addConstraint('baselines', {
      fields: ['targets_id'],
      type: 'unique',
      name: 'unique_baselines_targets_id',
    });

    await queryInterface.addIndex('baselines', ['targets_id'], {
      name: 'fk_baselines_targets_idx',
    });
    await queryInterface.addConstraint('baselines', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_baselines_targets',
      references: {
        table: 'targets',
        field: 'id',
      },
    });

    await queryInterface.createTable('engagement', {
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
    });

    await queryInterface.addIndex('engagement', ['url_id'], {
      name: 'fk_engagement_urls_idx',
    });
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

    await queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      targets_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      projects_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      provider: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cron: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      next_execution: {
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
      uuid: {
        type: 'BINARY(16)',
        allowNull: false,
        defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
      },
    });

    await queryInterface.addConstraint('schedules', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_schedules',
    });

    await queryInterface.addConstraint('schedules', {
      fields: ['targets_id', 'projects_id'],
      type: 'unique',
      name: 'unique_schedules_targets_projects',
    });

    await queryInterface.addIndex('schedules', ['targets_id'], {
      name: 'fk_schedules_targets2_idx',
    });
    await queryInterface.addIndex('schedules', ['projects_id'], {
      name: 'fk_schedules_projects1_idx',
    });

    await queryInterface.addConstraint('schedules', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_schedules_targets2',
      references: {
        table: 'targets',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('schedules', {
      fields: ['projects_id'],
      type: 'foreign key',
      name: 'fk_schedules_projects1',
      references: {
        table: 'projects',
        field: 'id',
      },
    });

    await queryInterface.createTable('plugins', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      teams_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      plugin_type: {
        type: Sequelize.ENUM(
          'TRIGGER',
          'PROVIDER',
          'SOURCE',
          'PROCESSING',
          'DELIVERY',
        ),
        allowNull: false,
      },
      arn: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
      plugin_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    });

    await queryInterface.addIndex('plugins', ['id'], {
      unique: true,
      name: 'id_UNIQUE_plugins',
    });

    await queryInterface.addConstraint('plugins', {
      fields: ['teams_id'],
      type: 'foreign key',
      name: 'fk_plugins_teams',
      references: {
        table: 'teams',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    await queryInterface.createTable('strategies', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      projects_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      stage: {
        type: Sequelize.ENUM('PR', 'CERT', 'QA', 'CMS', 'STAGE', 'PROD'),
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
      },
    });

    await queryInterface.addIndex('strategies', ['id'], {
      unique: true,
      name: 'id_UNIQUE_strategies',
    });

    await queryInterface.addConstraint('strategies', {
      fields: ['projects_id'],
      type: 'foreign key',
      name: 'fk_strategies_projects1',
      references: {
        table: 'projects',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    await queryInterface.createTable('slots', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      strategies_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      plugins_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {},
      },
      min_outputs: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex('slots', ['id'], {
      unique: true,
      name: 'id_UNIQUE_slots',
    });

    await queryInterface.addConstraint('slots', {
      fields: ['strategies_id'],
      type: 'foreign key',
      name: 'fk_slots_strategies',
      references: {
        table: 'strategies',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
    await queryInterface.addConstraint('slots', {
      fields: ['plugins_id'],
      type: 'foreign key',
      name: 'fk_slots_plugins',
      references: {
        table: 'plugins',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    await queryInterface.createTable('triggers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      strategies_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      context: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('ON_DEMAND', 'SCHEDULE'),
        allowNull: false,
        defaultValue: 'ON_DEMAND',
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
    });

    await queryInterface.addConstraint('triggers', {
      fields: ['strategies_id'],
      type: 'foreign key',
      name: 'fk_triggers_strategies',
      references: {
        table: 'strategies',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    await queryInterface.createTable('playlists', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      memberships_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      strategies_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      triggers_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      manifest: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('CREATED', 'IN_PROCESS', 'FAILED', 'COMPLETE'),
        allowNull: false,
        defaultValue: 'CREATED',
      },
      next_step: {
        type: Sequelize.STRING,
        allowNull: true,
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
    });

    await queryInterface.addIndex('playlists', ['id'], {
      unique: true,
      name: 'id_UNIQUE_playlists',
    });

    await queryInterface.addConstraint('playlists', {
      fields: ['memberships_id'],
      type: 'foreign key',
      name: 'fk_playlists_memberships',
      references: {
        table: 'memberships',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
    await queryInterface.addConstraint('playlists', {
      fields: ['strategies_id'],
      type: 'foreign key',
      name: 'fk_playlists_strategies',
      references: {
        table: 'strategies',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
    await queryInterface.addConstraint('playlists', {
      fields: ['triggers_id'],
      type: 'foreign key',
      name: 'fk_playlists_triggers',
      references: {
        table: 'triggers',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    await queryInterface.createTable('pulses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      targets_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      url_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      playlists_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      uuid: {
        type: 'BINARY(16)',
        allowNull: false,
        defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))'),
      },
    });

    await queryInterface.addConstraint('pulses', {
      fields: ['uuid'],
      type: 'unique',
      name: 'uuid_unique_idx_pulses',
    });

    await queryInterface.addIndex('pulses', ['targets_id'], {
      name: 'fk_pulses_targets1_idx',
    });
    await queryInterface.addIndex('pulses', ['url_id'], {
      name: 'fk_pulses_urls_idx',
    });
    await queryInterface.addIndex('pulses', ['playlists_id'], {
      name: 'fk_pulses_playlists_idx',
    });

    await queryInterface.addConstraint('pulses', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_pulses_targets1',
      references: {
        table: 'targets',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('pulses', {
      fields: ['url_id'],
      type: 'foreign key',
      name: 'fk_pulses_urls',
      references: {
        table: 'urls',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('pulses', {
      fields: ['playlists_id'],
      type: 'foreign key',
      name: 'fk_pulses_playlists',
      references: {
        table: 'playlists',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.createTable('heartbeats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pulses_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      retries: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ttfb: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      fcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      dcl: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      lcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      tti: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      si: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      cls: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      tbt: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      screenshots: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      },
      mode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      performance_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accessibility_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      seo_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      best_practices_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
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
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.addIndex('heartbeats', ['pulses_id'], {
      name: 'fk_heartbeats_pulses1_idx',
    });

    await queryInterface.addConstraint('heartbeats', {
      fields: ['pulses_id'],
      type: 'foreign key',
      name: 'fk_heartbeats_pulses1',
      references: {
        table: 'pulses',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.createTable('statistics', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      targets_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      provider: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      period: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ttfb: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      fcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      dcl: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      lcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      tti: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      si: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      cls: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      mode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      performance_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      accessibility_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      best_practices_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      seo_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pleasantness_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    });

    await queryInterface.addIndex('statistics', ['targets_id'], {
      name: 'fk_statistics_targets_idx',
    });
    await queryInterface.addConstraint('statistics', {
      fields: ['targets_id'],
      type: 'foreign key',
      name: 'fk_statistics_targets',
      references: {
        table: 'targets',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('statistics');
    await queryInterface.dropTable('heartbeats');
    await queryInterface.dropTable('pulses');
    await queryInterface.dropTable('playlists');
    await queryInterface.dropTable('triggers');
    await queryInterface.dropTable('slots');
    await queryInterface.dropTable('strategies');
    await queryInterface.dropTable('plugins');
    await queryInterface.dropTable('schedules');
    await queryInterface.dropTable('engagement');
    await queryInterface.dropTable('baselines');
    await queryInterface.dropTable('targets');
    await queryInterface.dropTable('urls');
    await queryInterface.dropTable('assignments');
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('memberships');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('teams');
  },
};
