import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  author: {
    // 🔒 Security: Reference the user who created the announcement.
    // This creates a clear audit trail and ownership link.
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
