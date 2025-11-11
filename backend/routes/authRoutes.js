
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router();

// 🔒 Security: Input validation and sanitization for the registration route.
// This middleware ensures that incoming data conforms to expected formats before it reaches
// the controller, preventing NoSQL injection, XSS, and other data-related vulnerabilities.
router.post('/register', [
  body('username').isString().trim().isLength({ min: 3 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
], registerUser);

// 🔒 Security: Input validation for the login route.
router.post('/login', [
  body('username').notEmpty().trim().escape(),
  body('password').notEmpty(),
], loginUser);

export default router;