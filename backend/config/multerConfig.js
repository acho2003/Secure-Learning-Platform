import multer from 'multer';
import path from 'path';

// 🔒 Security: Set up storage configuration for Multer.
// This controls where and how files are saved to the server's disk.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  // 🔒 Security: Sanitize the filename to prevent security risks.
  // We use the current timestamp and a random number to ensure the filename is unique,
  // preventing filename clashes and obfuscating original filenames.
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// 🔒 Security: Implement a file filter to control what types of files can be uploaded.
// This is a crucial security measure to prevent users from uploading malicious scripts
// or executable files. We only allow common document and presentation formats.
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File type not allowed. Only PDF, DOC, PPT, and images are supported.'), false);
};

// 🔒 Security: Initialize Multer with the secure storage, file filter, and size limits.
// The 'limits' option prevents DoS attacks where an attacker uploads excessively large files
// to exhaust server storage or bandwidth. Here we limit files to 5MB.
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});