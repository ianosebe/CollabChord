const express = require('express');
const router = express.Router();

const controller = require('./chat.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/**
 * Get chat history
 */
router.get('/:projectId', authMiddleware, controller.getMessages);

module.exports = router;
