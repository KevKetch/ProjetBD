module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Eleves', {
      matricule: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nom: { type: Sequelize.STRING(60), allowNull: false },
      prenom: { type: Sequelize.STRING(60) },
      dateNaissance: { type: Sequelize.DATEONLY },
      lieuNaissance: { type: Sequelize.STRING(30) },
      sexe: { type: Sequelize.SMALLINT }, // 1=M, 2=F
      langue: { type: Sequelize.STRING(30) },
      photoURL: { type: Sequelize.STRING(255) },
      actif: { type: Sequelize.TINYINT, defaultValue: 1 },
      idVilleNaissance: { type: Sequelize.INTEGER, references: { model: 'VilleNaissance', key: 'idVille' } },
      idAdmin: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Admin', key: 'ID' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE } // soft delete
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Eleves');
  }
};
