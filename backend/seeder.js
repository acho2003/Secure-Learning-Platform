import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'; // Optional: for colorful console output (npm install colors)

// 🔒 Security: Import models to interact with the database.
import User from './models/User.js';
import Announcement from './models/Announcement.js';
import Resource from './models/Resource.js';

// 🔒 Security: Load environment variables from .env file.
// This is crucial to securely access the database connection string
// without hardcoding it in the script.
dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...'.cyan.underline);
  } catch (error) {
    // 🔒 Security: Securely handle connection errors.
    // Log the error for the developer and exit the process to prevent
    // the script from continuing in an invalid state.
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// --- Sample Data ---
const users = [
  {
    username: 'admin',
    email: 'admin@admin.com',
    // 🔒 Security: Provide a plain-text password here. The Mongoose 'pre-save' hook in the User model
    // is responsible for securely hashing this password with bcrypt before it is ever stored in the database.
    // This separates concerns and ensures the hashing logic is always applied.
    password: 'password123',
    role: 'admin',
  },
  {
    username: 'instructor',
    email: 'instructor@example.com',
    password: 'password123',
    role: 'instructor',
  },
  {
    username: 'student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
  },
];

// --- Import Data Function ---
const importData = async () => {
  try {
    // 🔒 Security: Clear out old data to prevent conflicts and ensure a clean state.
    // This is important for creating a predictable database state for testing.
    await User.deleteMany();
    await Announcement.deleteMany();
    await Resource.deleteMany();

    // 🔒 Security: Use the User.create() method. This Mongoose method triggers all model middleware,
    // including the critical pre-save hook that hashes the user passwords.
    // Never insert users directly without going through the model's validation and hooks.
    await User.create(users);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// --- Destroy Data Function ---
const destroyData = async () => {
  try {
    // Clear all data from the collections.
    await User.deleteMany();
    await Announcement.deleteMany();
    await Resource.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};


// --- Script Execution Logic ---
const runSeeder = async () => {
    await connectDB();
    // 🔒 Security: This script is a powerful tool and should not be run in a production environment.
    // It is intended for development and testing purposes only.
    if (process.argv[2] === '-d') {
        // The '-d' flag is for 'destroy'.
        await destroyData();
    } else {
        // Default action is to import data.
        await importData();
    }
};

runSeeder();