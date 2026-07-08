const request = require('supertest');
const app = require('../../app');
const { sequelize, User, Role, Note, Eleve } = require('../../models');
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

describe('API Notes (intégration)', () => {
  it('POST /api/v1/notes – doit créer une note', async () => {
    const eleve = await Eleve.create({ nom: 'NoteTest', prenom: 'Test' });
    const noteData = {
      valeur: 14,
      eleve_matricule: eleve.matricule,
      matiere_id: 1,
      sequence_id: 1,
      enseignant_id: 1,
    };
    const res = await request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(noteData)
      .expect(201);
    expect(res.body.valeur).toBe(14);
  });

  it('GET /api/v1/notes/eleve/:matricule – doit retourner les notes d’un élève', async () => {
    const eleve = await Eleve.create({ nom: 'GetNotes', prenom: 'Test' });
    await Note.create({
      valeur: 12,
      eleve_matricule: eleve.matricule,
      matiere_id: 1,
      sequence_id: 1,
      enseignant_id: 1,
    });
    const res = await request(app)
      .get(`/api/v1/notes/eleve/${eleve.matricule}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
