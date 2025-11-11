// routes/announcementRoutes.js
import express from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  // 🔒 Security: All authenticated users can get announcements.
  .get(protect, getAnnouncements)
  // 🔒 Security: Only authenticated users with the 'admin' role can create announcements.
  .post(protect, authorize('admin'), createAnnouncement);

export default router;
