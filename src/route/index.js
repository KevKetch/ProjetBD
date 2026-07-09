const router = require('express').Router();
const authRoutes       = require('./authRoutes');
const eleveRoutes      = require('./eleveRoutes');
const noteRoutes       = require('./noteRoutes');
const incidentRoutes   = require('./incidentRoutes');
const presenceRoutes   = require('./presenceRoutes');
const classeRoutes     = require('./classeRoutes');
const matiereRoutes    = require('./matiereRoutes');
const sequenceRoutes   = require('./sequenceRoutes');
const enseignantRoutes = require('./enseignantRoutes');
const paiementRoutes   = require('./paiementRoutes');

router.use('/auth',       authRoutes);
router.use('/eleves',     eleveRoutes);
router.use('/notes',      noteRoutes);
router.use('/incidents',  incidentRoutes);
router.use('/presences',  presenceRoutes);
router.use('/classes',    classeRoutes);
router.use('/matieres',   matiereRoutes);
router.use('/sequences',  sequenceRoutes);
router.use('/enseignants', enseignantRoutes);
router.use('/paiements',  paiementRoutes);

module.exports = router;
