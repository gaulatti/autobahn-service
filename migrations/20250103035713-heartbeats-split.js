'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add new table to store the CWV metrics
     */
    await queryInterface.createTable('cwv_metrics', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      heartbeats_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ttfb: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      fcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      dcl: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      lcp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      tti: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      si: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      cls: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      tbt: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
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
     * Add Indexes
     */
    await queryInterface.addIndex('cwv_metrics', ['heartbeats_id'], {
      name: 'fk_cwv_metrics_heartbeats_idx',
    });
    await queryInterface.addConstraint('cwv_metrics', {
      fields: ['heartbeats_id'],
      type: 'foreign key',
      name: 'fk_cwv_metrics_heartbeats',
      references: {
        table: 'heartbeats',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    /**
     * Add new table to store the Lighthouse scores
     */
    await queryInterface.createTable('lighthouse_scores', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      heartbeats_id: {
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
     * Add Indexes
     */
    await queryInterface.addIndex('lighthouse_scores', ['heartbeats_id'], {
      name: 'fk_lighthouse_scores_heartbeats_idx',
    });
    await queryInterface.addConstraint('lighthouse_scores', {
      fields: ['heartbeats_id'],
      type: 'foreign key',
      name: 'fk_lighthouse_scores_heartbeats',
      references: {
        table: 'heartbeats',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    /**
     * Migrate data from heartbeats to CWV metrics
     */
    await queryInterface.sequelize.query(`
      INSERT INTO cwv_metrics (heartbeats_id, ttfb, fcp, dcl, lcp, tti, si, cls, tbt, created_at, updated_at)
      SELECT id, ttfb, fcp, dcl, lcp, tti, si, cls, tbt, created_at, updated_at
      FROM heartbeats
    `);

    /**
     * Migrate data from heartbeats to Lighthouse scores
     */
    await queryInterface.sequelize.query(`
      INSERT INTO lighthouse_scores (heartbeats_id, performance_score, accessibility_score, seo_score, best_practices_score, created_at, updated_at)
      SELECT id, performance_score, accessibility_score, seo_score, best_practices_score, created_at, updated_at
      FROM heartbeats
    `);

    /**
     * Remove CWV metrics and Lighthouse scores from heartbeats
     */
    await queryInterface.removeColumn('heartbeats', 'ttfb');
    await queryInterface.removeColumn('heartbeats', 'fcp');
    await queryInterface.removeColumn('heartbeats', 'dcl');
    await queryInterface.removeColumn('heartbeats', 'lcp');
    await queryInterface.removeColumn('heartbeats', 'tti');
    await queryInterface.removeColumn('heartbeats', 'si');
    await queryInterface.removeColumn('heartbeats', 'cls');
    await queryInterface.removeColumn('heartbeats', 'tbt');
    await queryInterface.removeColumn('heartbeats', 'performance_score');
    await queryInterface.removeColumn('heartbeats', 'accessibility_score');
    await queryInterface.removeColumn('heartbeats', 'seo_score');
    await queryInterface.removeColumn('heartbeats', 'best_practices_score');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add the columns back to heartbeats
     */
    await queryInterface.addColumn('heartbeats', 'ttfb', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'fcp', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'dcl', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'lcp', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'tti', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'si', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'cls', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'tbt', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('heartbeats', 'performance_score', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('heartbeats', 'accessibility_score', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('heartbeats', 'seo_score', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('heartbeats', 'best_practices_score', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    /**
     * Migrate data from CWV metrics back to heartbeats
     */
    await queryInterface.sequelize.query(`
      UPDATE heartbeats
      SET ttfb = (SELECT ttfb FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          fcp = (SELECT fcp FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          dcl = (SELECT dcl FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          lcp = (SELECT lcp FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          tti = (SELECT tti FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          si = (SELECT si FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          cls = (SELECT cls FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          tbt = (SELECT tbt FROM cwv_metrics WHERE cwv_metrics.heartbeats_id = heartbeats.id),
          performance_score = (SELECT performance_score FROM lighthouse_scores WHERE lighthouse_scores.heartbeats_id = heartbeats.id),
          accessibility_score = (SELECT accessibility_score FROM lighthouse_scores WHERE lighthouse_scores.heartbeats_id = heartbeats.id),
          seo_score = (SELECT seo_score FROM lighthouse_scores WHERE lighthouse_scores.heartbeats_id = heartbeats.id),
          best_practices_score = (SELECT best_practices_score FROM lighthouse_scores WHERE lighthouse_scores.heartbeats_id = heartbeats.id)
    `);

    /**
     * Drop the new tables
     */
    await queryInterface.removeConstraint(
      'cwv_metrics',
      'fk_cwv_metrics_heartbeats',
    );
    await queryInterface.removeIndex(
      'cwv_metrics',
      'fk_cwv_metrics_heartbeats_idx',
    );
    await queryInterface.removeConstraint(
      'lighthouse_scores',
      'fk_lighthouse_scores_heartbeats',
    );
    await queryInterface.removeIndex(
      'lighthouse_scores',
      'fk_lighthouse_scores_heartbeats_idx',
    );

    await queryInterface.dropTable('cwv_metrics');
    await queryInterface.dropTable('lighthouse_scores');
  },
};
