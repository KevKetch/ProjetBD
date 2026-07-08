require('dotenv').config();
const app = require('./app');
const { initQueue } = require('./jobs');

const PORT = process.env.PORT || 3000;

// Initialiser les workers Bull
initQueue();

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
