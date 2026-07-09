const router = require('express').Router();
const { sendMessage, inbox, sent, markRead } = require('../controllers/messageController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, sendMessage);
router.get('/inbox', authenticate, inbox);
router.get('/sent', authenticate, sent);
router.put('/:id/read', authenticate, markRead);

module.exports = router;
