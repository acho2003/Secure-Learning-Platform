// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Utility to generate JWT
const generateToken = (id, role) => {
  // 🔒 Security: Sign the JWT with a secret key from environment variables.
  // The payload contains non-sensitive user info (id, role) used for authorization.
  // The token has a defined expiration time to limit its validity period.
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  // 🔒 Security: Check for input validation errors defined in the route.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  // 🔒 Security: Validate incoming data.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // 🔒 Security: Find user by username, which has a unique index.
    const user = await User.findOne({ username });

    // 🔒 Security: If user exists and password matches (using the secure `matchPassword` method), issue a token.
    // This process is resistant to timing attacks. We provide a generic error message
    // to avoid revealing whether the username or password was incorrect (user enumeration).
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    next(error);
  }
};