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
  origin: '*',
  credentials: false,
}));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl || req.url}`);
  next();
});

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
});
app.use(limiter);

// Routes — exposed under both /api/v1 (canonical) and /api (frontend compat)
app.use('/api/v1', routes);
app.use('/api', routes);

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'École Primaire API' }));

// Gestion des erreurs
app.use(handleError);

module.exports = app;
