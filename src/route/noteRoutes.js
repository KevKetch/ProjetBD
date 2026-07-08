const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const noteController = require('../controllers/noteController');

const createNoteSchema = Joi.object({
  eleve_matricule: Joi.string().required(),
  matiere_id: Joi.number().required(),
  sequence_id: Joi.number().required(),
  enseignant_id: Joi.number().required(),
  valeur: Joi.number().min(0).max(20).required(),
  appreciation: Joi.string().allow(''),
  date_saisie: Joi.date().allow(null),
});

router.use(authenticate, blockFondateur);

router.post('/', checkRole(['directeur', 'enseignant']), validate(createNoteSchema), noteController.createNote);
router.get('/eleve/:matricule', checkRole(['directeur', 'enseignant', 'parent']), noteController.getNotesEleve);
router.get('/classe/:classe_id', checkRole(['directeur', 'enseignant']), noteController.getNotesClasse);
router.get('/matiere/:matiere_id', checkRole(['directeur', 'enseignant']), noteController.getNotesMatiere);
router.get('/sequence/:sequence_id', checkRole(['directeur', 'enseignant']), noteController.getNotesSequence);
router.get('/eleve/:matricule/moyennes', checkRole(['directeur', 'enseignant', 'parent']), noteController.getMoyennes);
router.post('/bulletins/generate', checkRole(['directeur', 'enseignant']), noteController.generateBulletin);
router.get('/bulletins/:id/pdf', checkRole(['directeur', 'enseignant', 'parent']), noteController.getBulletinPdf);
router.get('/eleve/:matricule/bulletins', checkRole(['directeur', 'enseignant', 'parent']), noteController.getBulletinsEleve);
router.get('/statistiques', checkRole(['directeur']), noteController.getStatistiquesNotes);

module.exports = router;
