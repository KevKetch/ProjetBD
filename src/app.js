const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./route');
const { handleError } = require('./utils/errorHandler');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:3001',   // Mini-serveur JSON (compatibilité)
    'http://127.0.0.1:5173',
    /^http:\/\/localhost:\d+$/ // Tout port localhost en développement
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl || req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('[BODY]', req.body);
  }
  next();
});


// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api/v1', routes);

// Gestion des erreurs
app.use(handleError);

module.exports = app;
