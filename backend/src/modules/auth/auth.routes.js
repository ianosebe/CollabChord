const express = require('express');
const router = express.Router();

const controller = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');
const validate = require('../../middleware/validate');
const { authLimiter } = require('../../middleware/rateLimit.middleware');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/register', authLimiter, registerValidation, validate, controller.register);
router.post('/login', authLimiter, loginValidation, validate, controller.login);

// Protected route to verify auth token
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      bio: req.user.bio,
      avatar: req.user.avatar
    }
  });
});

module.exports = router;
