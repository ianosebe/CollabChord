const express = require('express');
const router = express.Router();

const controller = require('./activity.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/**
 * Global feed
 */
router.get('/global', controller.globalFeed);

/**
 * Personal feed
 */
router.get('/me', authMiddleware, controller.myFeed);

module.exports = router;
