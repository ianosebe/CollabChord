const express = require('express');
const router = express.Router();

const controller = require('./project.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/**
 * Create project (auth required)
 */
router.post('/', authMiddleware, controller.create);

/**
 * Get all projects (public feed)
 */
router.get('/', controller.getAll);

/**
 * Get single project
 */
router.get('/:id', controller.getOne);

/**
 * Delete project (auth required)
 */
router.delete('/:id', authMiddleware, controller.remove);

module.exports = router;
