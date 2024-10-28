// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const validateAndSanitize = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitize request body to prevent XSS
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = sanitizeHtml(req.body[key]);
    }
  }

  next();
};

module.exports = { validateAndSanitize };
