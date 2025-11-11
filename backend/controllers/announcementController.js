// controllers/announcementController.js
import Announcement from '../models/Announcement.js';

// @desc    Get all announcements
// @route   GET /api/announcements
export const getAnnouncements = async (req, res, next) => {
  try {
    // 🔒 Security: Populate the 'author' field but only select the 'username'.
    // This prevents sensitive user data (like email or role) from being exposed.
    const announcements = await Announcement.find({})
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new announcement
// @route   POST /api/announcements
export const createAnnouncement = async (req, res, next) => {
  // 🔒 Security: Input validation should be added here with express-validator for production robustness.
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const announcement = new Announcement({
      title,
      content,
      // 🔒 Security: The author is set to the ID of the authenticated user from the request object.
      // This prevents a user from creating an announcement on behalf of someone else.
      author: req.user._id,
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    next(error);
  }
};