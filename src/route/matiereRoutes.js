const router = require('express').Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const matiereController = require('../controllers/matiereController');

router.use(authenticate);

router.get('/',    checkRole(['directeur', 'enseignant', 'admin']), matiereController.listMatieres);
router.get('/:id', checkRole(['directeur', 'enseignant', 'admin']), matiereController.getMatiere);
router.post('/',   checkRole(['directeur', 'admin']),               matiereController.createMatiere);
router.put('/:id', checkRole(['directeur', 'admin']),               matiereController.updateMatiere);
router.delete('/:id', checkRole(['directeur', 'admin']),            matiereController.deleteMatiere);

module.exports = router;
