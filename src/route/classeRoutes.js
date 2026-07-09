const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const classeController = require('../controllers/classeController');

router.use(authenticate);

router.get('/',    checkRole(['directeur', 'enseignant', 'admin']), classeController.listClasses);
router.get('/:id', checkRole(['directeur', 'enseignant', 'admin']), classeController.getClasse);
router.post('/',   checkRole(['directeur', 'admin']),               classeController.createClasse);
router.put('/:id', checkRole(['directeur', 'admin']),               classeController.updateClasse);
router.delete('/:id', checkRole(['directeur', 'admin']),            classeController.deleteClasse);

module.exports = router;
