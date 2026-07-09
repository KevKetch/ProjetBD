const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

/**
 * POST /api/v1/auth/login
 * Body: { email, password } ou { email, motDePasse }
 */
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.put('/profile', authenticate, authController.updateProfile);

router.get('/', authenticate, authController.listUsers);
router.post('/', authenticate, authController.createUser);
router.delete('/:id', authenticate, authController.deleteUser);

module.exports = router;
