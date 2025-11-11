import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 🔒 Security: Middleware to protect routes by verifying the user's JWT.
const protect = async (req, res, next) => {
  let token;

  // 🔒 Security: Check for the JWT in the 'Authorization' header, which is the standard place.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 🔒 Security: Verify the token using the secret from environment variables.
      // This ensures the token was signed by our server and has not been tampered with.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔒 Security: Fetch the user associated with the token from the database.
      // We exclude the password field from the result for security.
      // This step ensures the user still exists and attaches their data to the request object.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 🔒 Security: Middleware for Role-Based Access Control (RBAC).
// This function returns a middleware that checks if the authenticated user's role
// is included in the list of allowed roles for a specific route.
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      // 🔒 Security: If the user's role is not permitted, deny access with a 403 Forbidden status.
      return res.status(403).json({ message: `Access denied. User role '${req.user.role}' is not authorized.` });
    }
    next();
  };
};

export { protect, authorize };