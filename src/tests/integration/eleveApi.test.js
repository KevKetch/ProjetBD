// tests/integration/eleveApi.test.js
const request = require('supertest');
const app = require('../../app');
const { sequelize, User, Role, Eleve } = require('../../models');
const jwt = require('jsonwebtoken');

let token;
let adminUser;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Créer un administrateur (directeur)
  adminUser = await User.create({
    email: 'directeur@ecole.com',
    password: 'password123',
    nom: 'Admin',
    prenom: 'Test',
    typeAdmin: 2, // directeur
  });

  // Lui attribuer le rôle directeur
  const role = await Role.findOne({ where: { name: 'directeur' } });
  await adminUser.addRole(role);

  // Générer un token JWT
  token = jwt.sign({ ID: adminUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('API Élèves', () => {
  it('GET /api/v1/eleves – doit retourner une liste paginée', async () => {
    // Créer quelques élèves
    await Eleve.bulkCreate([
      { nom: 'Durand', prenom: 'Paul', idAdmin: adminUser.id },
      { nom: 'Martin', prenom: 'Claire', idAdmin: adminUser.id },
    ]);

    const res = await request(app)
      .get('/api/v1/eleves')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta.total).toBe(2);
  });

  it('GET /api/v1/eleves/:matricule – doit retourner un élève existant', async () => {
    const eleve = await Eleve.create({
      nom: 'Dupont',
      prenom: 'Jean',
      idAdmin: adminUser.id,
    });

    const res = await request(app)
      .get(`/api/v1/eleves/${eleve.matricule}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.matricule).toBe(eleve.matricule);
    expect(res.body.nom).toBe('Dupont');
  });

  it('POST /api/v1/eleves – doit créer un élève', async () => {
    const newEleve = {
      nom: 'Moreau',
      prenom: 'Sophie',
      dateNaissance: '2016-03-15',
      sexe: 2,
      idAdmin: adminUser.id,
    };

    const res = await request(app)
      .post('/api/v1/eleves')
      .set('Authorization', `Bearer ${token}`)
      .send(newEleve)
      .expect(201);

    expect(res.body.nom).toBe('Moreau');
    expect(res.body.matricule).toBeDefined();
  });

  it('PUT /api/v1/eleves/:matricule – doit mettre à jour un élève', async () => {
    const eleve = await Eleve.create({
      nom: 'Lefevre',
      prenom: 'Luc',
      idAdmin: adminUser.id,
    });

    const res = await request(app)
      .put(`/api/v1/eleves/${eleve.matricule}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ prenom: 'Lucas' })
      .expect(200);

    expect(res.body.prenom).toBe('Lucas');
  });

  it('DELETE /api/v1/eleves/:matricule – doit supprimer logiquement un élève', async () => {
    const eleve = await Eleve.create({
      nom: 'Bernard',
      prenom: 'Anne',
      idAdmin: adminUser.id,
    });

    await request(app)
      .delete(`/api/v1/eleves/${eleve.matricule}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const found = await Eleve.findByPk(eleve.matricule);
    expect(found).toBeNull();
  });

  it('POST /api/v1/eleves/:matricule/inscrire – doit inscrire un élève dans une classe', async () => {
    const eleve = await Eleve.create({
      nom: 'Roux',
      prenom: 'Emma',
      idAdmin: adminUser.id,
    });
    // On suppose qu'une salle et une année académique existent (à créer au préalable)
    // Ici on simule une inscription avec des IDs factices.
    const res = await request(app)
      .post(`/api/v1/eleves/${eleve.matricule}/inscrire`)
      .set('Authorization', `Bearer ${token}`)
      .send({ idSalle: 1, idAcademi: 1 })
      .expect(200);
    expect(res.body.frequente).toBeDefined();
  });

  it('GET /api/v1/eleves/:matricule/pdf – doit retourner une URL de PDF', async () => {
    const eleve = await Eleve.create({
      nom: 'Petit',
      prenom: 'Marie',
      idAdmin: adminUser.id,
    });

    const res = await request(app)
      .get(`/api/v1/eleves/${eleve.matricule}/pdf`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.pdf_url).toMatch(/^http/);
  });

  it('devrait refuser l’accès au Fondateur', async () => {
    // Créer un utilisateur fondateur
    const fondateur = await User.create({
      email: 'fondateur@ecole.com',
      password: 'password',
      typeAdmin: 1,
    });
    const tokenFondateur = jwt.sign({ ID: fondateur.id }, process.env.JWT_SECRET);

    const res = await request(app)
      .get('/api/v1/eleves')
      .set('Authorization', `Bearer ${tokenFondateur}`)
      .expect(403);
    expect(res.body.message).toMatch(/Fondateur n'a pas accès/);
  });
});
