const router = require('express').Router();
const eleveRoutes = require('./eleveRoutes');
const noteRoutes = require('./noteRoutes');
const incidentRoutes = require('./incidentRoutes');
const presenceRoutes = require('./presenceRoutes');

router.use('/eleves', eleveRoutes);
router.use('/notes', noteRoutes);
router.use('/incidents', incidentRoutes);
router.use('/presences', presenceRoutes);

module.exports = router;
