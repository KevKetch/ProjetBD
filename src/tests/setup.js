// tests/setup.js
const { sequelize } = require('home/ndam/claude/Node-Backend/src/models');

beforeAll(async () => {
  // Synchronise les modèles avec la base de test (force: true => recrée les tables)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
