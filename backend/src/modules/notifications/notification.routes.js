const express = require('express');
const router = express.Router();

const controller = require('./notification.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/**
 * Get notifications
 */
router.get('/', authMiddleware, controller.getMyNotifications);

/**
 * Mark as read
 */
router.patch('/:id/read', authMiddleware, controller.markRead);

module.exports = router;
