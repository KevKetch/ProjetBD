module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notes', {
      idNote: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      note: { type: Sequelize.FLOAT, allowNull: false },
      appreciation: { type: Sequelize.STRING(255) },
      matricule: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Eleves', key: 'matricule' } },
      idEpreuve: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Epreuve', key: 'idEpreuve' } },
      idMatiere: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Matieres', key: 'idMatiere' } },
      idSequence: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Sequences', key: 'idSequence' } },
      idPers: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Personne', key: 'idPers' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Notes');
  }
};
