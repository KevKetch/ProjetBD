'use strict';

// Le module paiement n'existait pas du tout dans le projet d'origine
// (aucun modèle, aucune migration, aucune route). On reprend les champs de
// l'entité `Paiement` du schéma fourni (idPaie, matricule, idAca, montant,
// url, comentaire, idMode, operation_ID, idPers, datePaie, dateEnregistrer)
// en les adaptant aux conventions déjà utilisées ailleurs dans ce projet :
// - `matricule` référence Eleves.matricule comme dans Notes/Incidents.
// - `idAnnee` reste un entier libre (comme Classe.idCycle / Eleve.idAdmin),
//   sans modèle Sequelize dédié pour AnneeAcademique : ce choix suit le
//   même pattern déjà utilisé dans ce projet plutôt que d'introduire un
//   nouveau modèle hors du périmètre demandé.
// - `enregistre_par_id` remplace `idPers` : dans ce projet l'acteur
//   authentifié est un `User`/`Admin`, pas une ligne de `Personne`
//   (qui n'est quasiment pas utilisée), donc on référence Users.id.

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Paiements', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      matricule: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Eleves', key: 'matricule' },
      },
      idAnnee: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      montant: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      mode_paiement: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'especes', // especes | mobile_money | virement | cheque
      },
      statut: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'paye', // paye | partiel | annule
      },
      numero_recu: { type: Sequelize.STRING(50), unique: true },
      operation_ID: { type: Sequelize.STRING(50) }, // référence externe (mobile money, virement...)
      commentaire: { type: Sequelize.STRING(255) },
      recu_url: { type: Sequelize.STRING(255) },
      date_paiement: { type: Sequelize.DATEONLY, allowNull: false },
      enregistre_par_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Paiements');
  },
};
