const express = require('express');
const router = express.Router();

const controller = require('./collab.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/**
 * Invite user to project
 */
router.post('/invite', authMiddleware, controller.invite);

/**
 * Accept invite
 */
router.post('/accept', authMiddleware, controller.accept);

/**
 * Reject invite
 */
router.post('/reject', authMiddleware, controller.reject);

/**
 * Get project collaborators
 */
router.get('/project/:id', controller.getProjectCollabs);

module.exports = router;
