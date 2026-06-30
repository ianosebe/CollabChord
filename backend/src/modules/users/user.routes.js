const express = require('express');
const router = express.Router();

const controller = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/**
 * Protected routes
 */
router.get('/me', authMiddleware, controller.getMe);
router.put('/me', authMiddleware, controller.updateMe);

/**
 * Public profile
 */
router.get('/:id', controller.getUser);

module.exports = router;
