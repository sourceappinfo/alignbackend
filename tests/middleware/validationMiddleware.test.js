// tests/middleware/validationMiddleware.test.js
const { validationMiddleware } = require('../../middleware/validationMiddleware');
const { ValidationError } = require('../../utils/errorTypes');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Required Fields', () => {
    it('should validate required fields', async () => {
      const validation = validationMiddleware({
        email: { required: true },
        password: { required: true }
      });

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('required')
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass when all required fields are provided', async () => {
      const validation = validationMiddleware({
        email: { required: true },
        password: { required: true }
      });

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      await validation(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Type Validation', () => {
    it('should validate field types', async () => {
      const validation = validationMiddleware({
        age: { required: true, type: 'number' },
        active: { required: true, type: 'boolean' }
      });

      req.body = {
        age: 'not-a-number',
        active: 'not-a-boolean'
      };

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('type')
      });
    });

    it('should pass with correct field types', async () => {
      const validation = validationMiddleware({
        age: { required: true, type: 'number' },
        active: { required: true, type: 'boolean' }
      });

      req.body = {
        age: 25,
        active: true
      };

      await validation(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Length Validation', () => {
    it('should validate minimum length', async () => {
      const validation = validationMiddleware({
        password: { required: true, min: 8 }
      });

      req.body = {
        password: 'short'
      };

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('at least 8 characters')
      });
    });

    it('should validate maximum length', async () => {
      const validation = validationMiddleware({
        username: { required: true, max: 10 }
      });

      req.body = {
        username: 'verylongusername'
      };

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('no more than 10 characters')
      });
    });
  });

  describe('Pattern Validation', () => {
    it('should validate email pattern', async () => {
      const validation = validationMiddleware({
        email: { 
          required: true,
          pattern: /^\S+@\S+\.\S+$/
        }
      });

      req.body = {
        email: 'invalid-email'
      };

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('format is invalid')
      });
    });

    it('should pass with valid email pattern', async () => {
      const validation = validationMiddleware({
        email: {
          required: true,
          pattern: /^\S+@\S+\.\S+$/
        }
      });

      req.body = {
        email: 'test@example.com'
      };

      await validation(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Custom Validation', () => {
    it('should handle custom validation functions', async () => {
      const validation = validationMiddleware({
        age: {
          required: true,
          type: 'number',
          custom: (value) => value >= 18 ? null : 'Must be at least 18 years old'
        }
      });

      req.body = {
        age: 16
      };

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('at least 18 years old')
      });
    });

    it('should pass custom validation', async () => {
      const validation = validationMiddleware({
        age: {
          required: true,
          type: 'number',
          custom: (value) => value >= 18 ? null : 'Must be at least 18 years old'
        }
      });

      req.body = {
        age: 21
      };

      await validation(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Multiple Validations', () => {
    it('should handle multiple validation rules', async () => {
      const validation = validationMiddleware({
        username: {
          required: true,
          min: 3,
          max: 20,
          pattern: /^[a-zA-Z0-9_]+$/
        },
        email: {
          required: true,
          pattern: /^\S+@\S+\.\S+$/
        },
        age: {
          required: true,
          type: 'number',
          custom: (value) => value >= 18 ? null : 'Must be at least 18 years old'
        }
      });

      req.body = {
        username: 'a',
        email: 'invalid-email',
        age: 16
      };

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('at least 3 characters')
      });
    });

    it('should pass multiple validation rules', async () => {
      const validation = validationMiddleware({
        username: {
          required: true,
          min: 3,
          max: 20,
          pattern: /^[a-zA-Z0-9_]+$/
        },
        email: {
          required: true,
          pattern: /^\S+@\S+\.\S+$/
        },
        age: {
          required: true,
          type: 'number',
          custom: (value) => value >= 18 ? null : 'Must be at least 18 years old'
        }
      });

      req.body = {
        username: 'validuser',
        email: 'test@example.com',
        age: 21
      };

      await validation(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle validation function errors', async () => {
      const validation = validationMiddleware({
        field: {
          required: true,
          custom: () => { throw new Error('Custom validation error'); }
        }
      });

      req.body = {
        field: 'value'
      };

      await validation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('Custom validation error')
      });
    });
  });
});