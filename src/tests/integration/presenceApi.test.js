const request = require('supertest');
const app = require('../../app');
const { sequelize, User, Role, Presence, Eleve } = require('../../models');
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const adminUser = await User.create({
    email: 'directeur@ecole.com',
    password: 'password',
    typeAdmin: 2,
  });
  const role = await Role.findOne({ where: { name: 'directeur' } });
  await adminUser.addRole(role);
  token = jwt.sign({ ID: adminUser.id }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await sequelize.close();
});

describe('API Présences (intégration)', () => {
  it('POST /api/v1/presences – doit créer une présence', async () => {
    const eleve = await Eleve.create({ nom: 'PresenceTest', prenom: 'Test' });
    const presenceData = {
      eleve_matricule: eleve.matricule,
      date: '2025-01-01',
      statut: 'present',
    };
    const res = await request(app)
      .post('/api/v1/presences/eleve')
      .set('Authorization', `Bearer ${token}`)
      .send(presenceData)
      .expect(201);
    expect(res.body.statut).toBe('present');
  });

  it('GET /api/v1/presences/eleve/:matricule – doit lister les présences d’un élève', async () => {
    const eleve = await Eleve.create({ nom: 'GetPresences', prenom: 'Test' });
    await Presence.create({
      eleve_matricule: eleve.matricule,
      date: '2025-01-02',
      statut: 'absent',
      motif_absence: 'Maladie',
    });
    const res = await request(app)
      .get(`/api/v1/presences/eleve/${eleve.matricule}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
