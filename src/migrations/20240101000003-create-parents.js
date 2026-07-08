module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Parents', {
      idParent: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      idPers: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Personne', key: 'idPers' } },
      matricule: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Eleves', key: 'matricule' } },
      idAdmin: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Admin', key: 'ID' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Parents');
  }
};
