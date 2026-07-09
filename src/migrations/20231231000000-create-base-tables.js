module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Table Admin
    await queryInterface.createTable('Admin', {
      ID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nom: { type: Sequelize.STRING(100), allowNull: false },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      actif: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      typeAdmin: { type: Sequelize.SMALLINT, allowNull: false },
      mobile: Sequelize.STRING(15),
      alanyaID: Sequelize.STRING(15),
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 2. Table VilleNaissance
    await queryInterface.createTable('VilleNaissance', {
      idVille: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nomVille: { type: Sequelize.STRING(100) }
    });

    // 3. Table Personne
    await queryInterface.createTable('Personne', {
      idPers: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nom: Sequelize.STRING(100),
      prenom: Sequelize.STRING(100)
    });

    // 4. Table Cycle
    await queryInterface.createTable('Cycle', {
      idCycle: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: Sequelize.STRING(100)
    });

    // 5. Table AnneeAcademique
    await queryInterface.createTable('AnneeAcademique', {
      idAnnee: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: { type: Sequelize.STRING(100), allowNull: false },
      periode: { type: Sequelize.STRING(100) },
      idAdmin: { type: Sequelize.INTEGER, references: { model: 'Admin', key: 'ID' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 6. Table Trimestre
    await queryInterface.createTable('Trimestre', {
      idTrimes: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: { type: Sequelize.STRING(100), allowNull: false },
      periode: { type: Sequelize.STRING(100) },
      idAca: { type: Sequelize.INTEGER, references: { model: 'AnneeAcademique', key: 'idAnnee' } },
      idAdmin: { type: Sequelize.INTEGER, references: { model: 'Admin', key: 'ID' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 7. Table Epreuve
    await queryInterface.createTable('Epreuve', {
      idEpreuve: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: Sequelize.STRING(100)
    });

    // 8. Insertion des enregistrements par défaut pour éviter les erreurs de clés étrangères dans les seeds
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('root', 10);
    
    await queryInterface.bulkInsert('Admin', [{
      ID: 1,
      nom: 'Administrateur',
      username: 'admin@ecole.cm',
      password: hashedPassword,
      actif: 1,
      typeAdmin: 3,
      mobile: '000000000',
      alanyaID: '000000000',
      created_at: new Date()
    }]);

    await queryInterface.bulkInsert('Personne', [{
      idPers: 1,
      nom: 'Directeur',
      prenom: 'Général'
    }]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Epreuve');
    await queryInterface.dropTable('Trimestre');
    await queryInterface.dropTable('AnneeAcademique');
    await queryInterface.dropTable('Cycle');
    await queryInterface.dropTable('Personne');
    await queryInterface.dropTable('VilleNaissance');
    await queryInterface.dropTable('Admin');
  }
};
