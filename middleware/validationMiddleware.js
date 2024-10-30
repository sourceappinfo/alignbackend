const { ValidationError } = require('../utils/errorTypes');
const logger = require('../utils/logger');

const validationMiddleware = (validations) => {
  return async (req, res, next) => {
    try {
      const errors = [];
      
      for (const field in validations) {
        const value = req.body[field];
        const rules = validations[field];

        if (rules.required && !value) {
          errors.push(`${field} is required`);
          continue;
        }

        if (value) {
          if (rules.type && typeof value !== rules.type) {
            errors.push(`${field} must be of type ${rules.type}`);
          }

          if (rules.min && value.length < rules.min) {
            errors.push(`${field} must be at least ${rules.min} characters`);
          }

          if (rules.max && value.length > rules.max) {
            errors.push(`${field} must be no more than ${rules.max} characters`);
          }

          if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${field} format is invalid`);
          }

          if (rules.custom) {
            const customError = await rules.custom(value);
            if (customError) {
              errors.push(customError);
            }
          }
        }
      }

      if (errors.length > 0) {
        throw new ValidationError(errors.join(', '));
      }

      next();
    } catch (error) {
      logger.error(`Validation error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };
};

// Example usage:
const loginValidation = validationMiddleware({
  email: {
    required: true,
    type: 'string',
    pattern: /^\S+@\S+\.\S+$/,
    max: 255
  },
  password: {
    required: true,
    type: 'string',
    min: 8,
    max: 128
  }
});

module.exports = {
  validationMiddleware,
  loginValidation
};