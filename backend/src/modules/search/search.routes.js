const express = require('express');
const router = express.Router();

const controller = require('./search.controller');

/**
 * Search users
 */
router.get('/users', controller.users);

/**
 * Search projects
 */
router.get('/projects', controller.projects);

module.exports = router;
