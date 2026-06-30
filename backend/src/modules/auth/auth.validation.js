const { body } = require('express-validator');

const registerValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email, username, and password are required')
    .isEmail().withMessage('Invalid email format'),
  body('username')
    .trim()
    .notEmpty().withMessage('Email, username, and password are required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password')
    .notEmpty().withMessage('Email, username, and password are required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email and password are required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Email and password are required')
];

module.exports = {
  registerValidation,
  loginValidation
};
