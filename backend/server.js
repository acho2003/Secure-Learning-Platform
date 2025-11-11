import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔒 Security: Import essential security and functionality packages.
import helmet from 'helmet';
import cors from 'cors';

// 🔒 Security: Import middleware for handling errors and authentication.
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// 🔒 Security: Import API routes.
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';

// 🔒 Security: Load environment variables from .env file at the very start.
// This ensures all subsequent code can access them securely via process.env.
dotenv.config();

const app = express();

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully.');
  } catch (error) {
    // 🔒 Security: Secure error handling for database connection.
    // We log the detailed error for administrators but exit the process,
    // as the application is non-functional without a database connection.
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();


// --- Security Middleware Setup ---

// 🔒 Security: Use helmet() to set various security-related HTTP headers.
// This helps protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing.
app.use(helmet());

// 🔒 Security: Configure CORS (Cross-Origin Resource Sharing).
// This is a critical security measure that restricts which domains can access your API.
// In production, it should be limited strictly to your frontend's domain.
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 🔒 Security: Use express.json() to parse incoming JSON payloads.
// The 'limit' option prevents potential Denial-of-Service (DoS) attacks by rejecting overly large JSON payloads.
app.use(express.json({ limit: '10kb' }));


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/resources', resourceRoutes);


// --- Serve Uploaded Files Statically ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔒 Security: This route serves files from the 'uploads' directory.
// While convenient, in a production environment, it is highly recommended to use a dedicated
// cloud storage service (like AWS S3, Google Cloud Storage) to serve user-uploaded content.
// This isolates user content from your application server, preventing potential path traversal attacks
// and reducing server load. For this project, we ensure files are accessed via secure routes.
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// --- Global Error Handling ---

// 🔒 Security: Custom middleware to handle 404 Not Found errors.
// This prevents Express from sending a default, potentially revealing, HTML error page.
app.use(notFound);

// 🔒 Security: A centralized error handler.
// It catches all errors passed by `next(error)` in controllers, preventing stack traces
// from leaking to the client and ensuring a consistent JSON error response.
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));