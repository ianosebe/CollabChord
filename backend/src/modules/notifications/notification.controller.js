const notifService = require('./notification.service');

/**
 * GET /notifications
 */
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await notifService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    const updated = await notifService.markAsRead(req.params.id, req.user.id);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getMyNotifications,
  markRead
};
