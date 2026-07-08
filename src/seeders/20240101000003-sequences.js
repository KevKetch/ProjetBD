module.exports = {
  up: async (queryInterface) => {
    // On suppose que les tables Trimestre et AnneeAcademique existent déjà
    // On insère des séquences pour l'année en cours
    const annee = await queryInterface.rawSelect('AnneeAcademique', { where: { libelle: '2025-2026' } }, ['idAnnee']);
    if (!annee) {
      // Si l'année n'existe pas, on crée une année par défaut
      await queryInterface.bulkInsert('AnneeAcademique', [
        { libelle: '2025-2026', periode: 'Septembre 2025 - Juin 2026', created_at: new Date(), idAdmin: 1 }
      ]);
    }
    const anneeId = annee || (await queryInterface.rawSelect('AnneeAcademique', { where: { libelle: '2025-2026' } }, ['idAnnee']));
    const trimestres = await queryInterface.rawSelect('Trimestre', { where: { idAca: anneeId } }, ['idTrimes']);
    // Si pas de trimestres, on en crée
    if (!trimestres) {
      await queryInterface.bulkInsert('Trimestre', [
        { libelle: 'Trimestre 1', periode: 'Sept - Nov', idAca: anneeId, idAdmin: 1, created_at: new Date() },
        { libelle: 'Trimestre 2', periode: 'Déc - Fév', idAca: anneeId, idAdmin: 1, created_at: new Date() },
        { libelle: 'Trimestre 3', periode: 'Mar - Juin', idAca: anneeId, idAdmin: 1, created_at: new Date() }
      ]);
    }
    const trimestresList = await queryInterface.rawSelect('Trimestre', { where: { idAca: anneeId } }, ['idTrimes']);
    // On insère des séquences pour chaque trimestre (1 par trimestre par exemple)
    await queryInterface.bulkInsert('Sequences', [
      { libelle: 'Séquence 1 - T1', description: 'Première séquence du trimestre 1', idTrimestre: trimestresList[0], idPers: 1, created_at: new Date(), updated_at: new Date() },
      { libelle: 'Séquence 2 - T1', description: 'Deuxième séquence du trimestre 1', idTrimestre: trimestresList[0], idPers: 1, created_at: new Date(), updated_at: new Date() },
      { libelle: 'Séquence 1 - T2', description: 'Première séquence du trimestre 2', idTrimestre: trimestresList[1], idPers: 1, created_at: new Date(), updated_at: new Date() },
      { libelle: 'Séquence 2 - T2', description: 'Deuxième séquence du trimestre 2', idTrimestre: trimestresList[1], idPers: 1, created_at: new Date(), updated_at: new Date() },
      { libelle: 'Séquence 1 - T3', description: 'Première séquence du trimestre 3', idTrimestre: trimestresList[2], idPers: 1, created_at: new Date(), updated_at: new Date() },
      { libelle: 'Séquence 2 - T3', description: 'Deuxième séquence du trimestre 3', idTrimestre: trimestresList[2], idPers: 1, created_at: new Date(), updated_at: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Sequences', null, {});
  }
};
