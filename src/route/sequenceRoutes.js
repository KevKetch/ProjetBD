const router = require('express').Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const sequenceController = require('../controllers/sequenceController');

router.use(authenticate);

router.get('/',    checkRole(['directeur', 'enseignant', 'admin']), sequenceController.listSequences);
router.get('/:id', checkRole(['directeur', 'enseignant', 'admin']), sequenceController.getSequence);
router.post('/',   checkRole(['directeur', 'admin']),               sequenceController.createSequence);
router.put('/:id', checkRole(['directeur', 'admin']),               sequenceController.updateSequence);

module.exports = router;
