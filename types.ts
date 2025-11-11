export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export interface User {
  id: string; // Corresponds to _id from backend
  username: string;
  email: string;
  role: UserRole;
}

// Type for the populated author/uploader from the backend
interface PopulatedUser {
    _id: string;
    username: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: PopulatedUser; // Updated to match populated backend data
  createdAt: string;
}

export interface Resource {
  _id: string;
  filename: string; // The sanitized filename on the server
  originalname: string; // The original filename from the user
  size: number;
  uploadedBy: PopulatedUser; // Updated to match populated backend data
  createdAt: string;
}