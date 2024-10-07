'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'assignments',
      {
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
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb3',
      },
    );

    // Add unique constraint on projects_id and memberships_id
    await queryInterface.addConstraint('assignments', {
      fields: ['projects_id', 'memberships_id'],
      type: 'unique',
      name: 'unique_assignments_projects_memberships',
    });

    // Add indexes
    await queryInterface.addIndex('assignments', ['projects_id'], {
      name: 'fk_assignments_projects1_idx',
    });

    await queryInterface.addIndex('assignments', ['memberships_id'], {
      name: 'fk_assignments_memberships1_idx',
    });

    // Add foreign key constraints
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('assignments');
  },
};
