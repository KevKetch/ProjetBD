module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Matieres', {
      idMatiere: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: { type: Sequelize.STRING(255), allowNull: false },
      coefficient: { type: Sequelize.FLOAT, defaultValue: 1 },
      description: { type: Sequelize.TEXT },
      idAdmin: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Admin', key: 'ID' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Matieres');
  }
};
