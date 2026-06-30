const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable accessing :projectId from parent path

const controller = require('./audio.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Protect all audio routes
router.use(authMiddleware);

/**
 * Audio endpoints
 */
router.post('/upload', controller.upload);
router.get('/', controller.list);
router.get('/stream/:audioId', controller.stream);
router.get('/download/:audioId', controller.download);

module.exports = router;
