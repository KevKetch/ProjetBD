module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Classes', {
      idClasse: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: { type: Sequelize.STRING(100), allowNull: false },
      idCycle: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Cycle', key: 'idCycle' } },
      idAdmin: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Admin', key: 'ID' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Classes');
  }
};
