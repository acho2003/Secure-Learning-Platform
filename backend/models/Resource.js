
// models/Resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // The name for the user to see
  originalname: { type: String, required: true }, // The original uploaded file name
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  // 🔒 Security: Store the server path, but never expose it directly to the client.
  // The client will get a URL from a dedicated download route.
  path: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);