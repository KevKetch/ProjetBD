const { Message, User } = require('../models');

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user ? req.user.id : null;
    const { receiver_user_id, content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Content required' });
    const message = await Message.create({ sender_user_id: senderId, receiver_user_id: receiver_user_id || null, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

exports.inbox = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.findAll({ where: { receiver_user_id: userId }, order: [['created_at','DESC']] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

exports.sent = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.findAll({ where: { sender_user_id: userId }, order: [['created_at','DESC']] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message non trouvé' });
    if (message.receiver_user_id !== userId) return res.status(403).json({ success: false, message: 'Accès refusé' });
    message.read = true;
    await message.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};
