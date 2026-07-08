module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sequences', {
      idSequence: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      idTrimestre: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Trimestre', key: 'idTrimes' } },
      idPers: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Personne', key: 'idPers' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Sequences');
  }
};
