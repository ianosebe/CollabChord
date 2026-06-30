const express = require('express');
const router = express.Router();

const controller = require('./analytics.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/**
 * Platform stats (admin later)
 */
router.get('/platform', controller.platformStats);

/**
 * User stats
 */
router.get('/me', authMiddleware, controller.myStats);

module.exports = router;
