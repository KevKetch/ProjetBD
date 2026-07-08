const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./route');
const { handleError } = require('./utils/errorHandler');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
