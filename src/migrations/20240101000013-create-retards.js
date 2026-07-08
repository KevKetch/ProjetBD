module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Retards', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      matricule: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Eleves', key: 'matricule' } },
      date: { type: Sequelize.DATE, allowNull: false },
      duree: { type: Sequelize.INTEGER, comment: 'en minutes' },
      motif: { type: Sequelize.STRING(255) },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Retards');
  }
};
