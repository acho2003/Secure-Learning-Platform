
// routes/resourceRoutes.js
import express from 'express';
import { getResources, uploadResource, downloadResource } from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../config/multerConfig.js'; // We'll create this next

const router = express.Router();

router.route('/')
  // 🔒 Security: All authenticated users can get the list of resources.
  .get(protect, getResources);

router.route('/upload')
  // 🔒 Security: Only admins and instructors can upload files. The `upload.single('file')` middleware
  // from Multer processes the file upload securely.
  .post(protect, authorize('admin', 'instructor'), upload.single('file'), uploadResource);

router.route('/download/:id')
    // 🔒 Security: All authenticated users can download a resource. This route uses an ID
    // instead of a direct file path to prevent path traversal attacks.
    .get(protect, downloadResource);

export default router;