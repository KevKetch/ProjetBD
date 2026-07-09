module.exports = {
  up: async (queryInterface) => {
    // 1. Cycle par défaut
    const existingCycle = await queryInterface.rawSelect('Cycle', { where: { idCycle: 1 } }, ['idCycle']);
    if (!existingCycle) {
      await queryInterface.bulkInsert('Cycle', [
        { idCycle: 1, libelle: 'Cycle Francophone' },
        { idCycle: 2, libelle: 'Cycle Anglophone' }
      ]);
    }

    // 2. Classes de démonstration
    const existingClasse = await queryInterface.rawSelect('Classes', { where: { idClasse: 1 } }, ['idClasse']);
    if (!existingClasse) {
      await queryInterface.bulkInsert('Classes', [
        { idClasse: 1, libelle: 'SIL A', idCycle: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idClasse: 2, libelle: 'CP A', idCycle: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idClasse: 3, libelle: 'CE1 A', idCycle: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idClasse: 4, libelle: 'CE2 A', idCycle: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idClasse: 5, libelle: 'CM1 A', idCycle: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idClasse: 6, libelle: 'CM2 A', idCycle: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() }
      ]);
    }

    // 3. Matieres de démonstration
    const existingMatiere = await queryInterface.rawSelect('Matieres', { where: { idMatiere: 1 } }, ['idMatiere']);
    if (!existingMatiere) {
      await queryInterface.bulkInsert('Matieres', [
        { idMatiere: 1, libelle: 'Mathématiques', coefficient: 3, description: 'Calcul, géométrie, opérations', idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idMatiere: 2, libelle: 'Français', coefficient: 3, description: 'Grammaire, conjugaison, orthographe', idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idMatiere: 3, libelle: 'Sciences', coefficient: 2, description: 'Éveil scientifique, sciences de la vie', idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idMatiere: 4, libelle: 'Histoire-Géographie', coefficient: 2, description: 'Histoire et géographie du Cameroun', idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idMatiere: 5, libelle: 'Anglais', coefficient: 1, description: 'Bilinguisme anglais', idAdmin: 1, created_at: new Date(), updated_at: new Date() }
      ]);
    }

    // 4. Élèves de démonstration (Sexe : 1 = M, 2 = F)
    const existingEleve = await queryInterface.rawSelect('Eleves', { where: { matricule: 1 } }, ['matricule']);
    if (!existingEleve) {
      await queryInterface.bulkInsert('Eleves', [
        { matricule: 1, nom: 'Fouda', prenom: 'Jean', dateNaissance: '2016-04-12', lieuNaissance: 'Yaoundé', sexe: 1, langue: '1', actif: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { matricule: 2, nom: 'Mbarga', prenom: 'Marie', dateNaissance: '2016-09-25', lieuNaissance: 'Douala', sexe: 2, langue: '1', actif: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { matricule: 3, nom: 'Nkomo', prenom: 'Pierre', dateNaissance: '2015-02-14', lieuNaissance: 'Yaoundé', sexe: 1, langue: '2', actif: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { matricule: 4, nom: 'Sanda', prenom: 'Sophie', dateNaissance: '2015-07-22', lieuNaissance: 'Bafoussam', sexe: 2, langue: '2', actif: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { matricule: 5, nom: 'Mengue', prenom: 'Kevin', dateNaissance: '2014-11-05', lieuNaissance: 'Yaoundé', sexe: 1, langue: '3', actif: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() }
      ]);

      // 5. VilleNaissance
      await queryInterface.bulkInsert('VilleNaissance', [
        { idVille: 1, nomVille: 'Yaoundé' },
        { idVille: 2, nomVille: 'Douala' },
        { idVille: 3, nomVille: 'Bafoussam' }
      ]);

      // 6. Personnes (pour les parents)
      await queryInterface.bulkInsert('Personne', [
        { idPers: 2, nom: 'Fouda', prenom: 'Thomas' },
        { idPers: 3, nom: 'Mbarga', prenom: 'Joseph' },
        { idPers: 4, nom: 'Nkomo', prenom: 'Albert' }
      ]);

      // 7. Parents links
      await queryInterface.bulkInsert('Parents', [
        { idParent: 1, idPers: 2, matricule: 1, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idParent: 2, idPers: 3, matricule: 2, idAdmin: 1, created_at: new Date(), updated_at: new Date() },
        { idParent: 3, idPers: 4, matricule: 3, idAdmin: 1, created_at: new Date(), updated_at: new Date() }
      ]);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Parents', null, {});
    await queryInterface.bulkDelete('Personne', { idPers: { [Op.gt]: 1 } }, {});
    await queryInterface.bulkDelete('VilleNaissance', null, {});
    await queryInterface.bulkDelete('Eleves', null, {});
    await queryInterface.bulkDelete('Matieres', null, {});
    await queryInterface.bulkDelete('Classes', null, {});
    await queryInterface.bulkDelete('Cycle', null, {});
  }
};
