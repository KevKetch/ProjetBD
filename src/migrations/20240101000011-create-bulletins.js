module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bulletins', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      matricule: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Eleves', key: 'matricule' } },
      idSequence: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Sequences', key: 'idSequence' } },
      moyenne_generale: { type: Sequelize.FLOAT },
      appreciation: { type: Sequelize.TEXT },
      pdf_path: { type: Sequelize.STRING(255) },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Bulletins');
  }
};
