// tests/unit/eleve.test.js
const { Eleve, sequelize } = require('../../models');

describe('Eleve Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer un élève avec les champs obligatoires', async () => {
    const eleve = await Eleve.create({
      nom: 'Doe',
      prenom: 'John',
      date_naissance: '2015-01-01',
      sexe: 'M',
    });
    expect(eleve.matricule).toBeDefined();
    expect(eleve.nom).toBe('Doe');
    expect(eleve.prenom).toBe('John');
    expect(eleve.statut).toBe('actif');
  });

  it('devrait lever une erreur si le nom est manquant', async () => {
    await expect(Eleve.create({ prenom: 'Jane' }))
      .rejects
      .toThrow(/notNull Violation/);
  });

  it('devrait permettre la suppression logique (soft delete)', async () => {
    const eleve = await Eleve.create({
      nom: 'Smith',
      prenom: 'Alice',
    });
    await eleve.destroy();
    const found = await Eleve.findByPk(eleve.matricule);
    expect(found).toBeNull();
    const withTrashed = await Eleve.findByPk(eleve.matricule, { paranoid: false });
    expect(withTrashed).not.toBeNull();
    expect(withTrashed.deletedAt).not.toBeNull();
  });

  it('devrait avoir une relation avec Parents', async () => {
    // On ne teste pas ici l'association complète car elle nécessite d'autres modèles,
    // mais on vérifie que la méthode d'association existe.
    const eleve = Eleve.build();
    expect(typeof eleve.getParent).toBe('function');
  });
});
