const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg, // Extracted first error for legacy compatibility
      errors: errors.array()
    });
  }

  next();
};

module.exports = validate;
