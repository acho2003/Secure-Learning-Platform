Secure Learning Platform - ELE201
![alt text](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![alt text](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![alt text](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![alt text](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![alt text](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
A full-stack web application developed for the ELE201 Secure Coding module. This project is a functional online learning platform built with a primary focus on implementing robust security measures at every layer of the MERN stack. It demonstrates a practical understanding of ensuring data Confidentiality, Integrity, and Availability (CIA) in a multi-user environment.
Key Features
General Features
Role-Based Dashboards: Separate, tailored user interfaces for Admins, Instructors, and Students.
Announcement Management: Admins can create and post system-wide announcements.
Resource Management: Admins and Instructors can upload learning materials (e.g., PDFs, presentations), while all users can securely download them.
Multi-User System: Supports three distinct user roles with different permissions.
🛡️ Security Features
JWT Authentication: Secure, stateless authentication using JSON Web Tokens with defined expiration times.
bcrypt Password Hashing: User passwords are never stored in plain text. They are hashed with a strong salt using bcryptjs before being saved to the database.
Role-Based Access Control (RBAC): A secure middleware layer on the backend ensures that users can only access the API endpoints and perform the actions permitted by their role.
Server-Side Input Validation: Comprehensive validation and sanitization using express-validator to prevent XSS, NoSQL Injection, and other data-related attacks.
Secure Error Handling: A global error handler prevents the leakage of sensitive stack traces or internal application details to the client.
HTTP Security Headers: The helmet library is used to set various security-related HTTP headers to protect against common vulnerabilities like clickjacking and MIME-type sniffing.
Environment Variable Management: All sensitive keys, secrets, and database URIs are stored securely in .env files and are not hardcoded.
Technology Stack
Frontend: React, Vite, TypeScript, Axios, TailwindCSS
Backend: Node.js, Express.js, Mongoose
Database: MongoDB
Security Libraries: bcryptjs, jsonwebtoken, express-validator, helmet, cors, dotenv
Project Structure
code
Code
/secure-online-learning-platform
├── /backend          # Node.js & Express API
│   ├── /controllers
│   ├── /middleware
│   ├── /models
│   ├── /routes
│   ├── seeder.js     # Database seeder script
│   └── server.js     # Main server entry point
└── /frontend         # React & Vite UI
    ├── /src
    │   ├── /components
    │   ├── /contexts
    │   ├── /hooks
    │   ├── /pages
    │   └── /services
    └── vite.config.ts
Setup and Installation
Prerequisites
Node.js (v18 or later)
npm
MongoDB (either local or a cloud instance like MongoDB Atlas)
1. Clone the Repository
code
Bash
git clone <your-repository-url>
cd secure-online-learning-platform
2. Backend Setup
code
Bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend directory
# and add the following variables:
backend/.env
code
Ini
PORT=5000
MONGO_URI="your_mongodb_connection_string_here"
JWT_SECRET="generate_a_long_random_secure_secret_key"
JWT_EXPIRES_IN="1h"
``````bash
# Populate the database with initial users (admin, instructor, student)
npm run data:import

# Start the backend server
npm start
The backend server will be running on http://localhost:5000.
3. Frontend Setup
code
Bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Create a .env file in the /frontend directory
# and add the following variable:
frontend/.env
code
Ini
VITE_API_URL=http://localhost:5000
``````bash
# Start the frontend development server
npm run dev```
The frontend application will be available at `http://localhost:3000` (or another port specified by Vite).

## Usage and Default Credentials

The `npm run data:import` command populates the database with three default users.

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `password123` | Create announcements, upload resources. |
| **Instructor** | `instructor` | `password123` | Upload resources. |
| **Student** | `student` | `password123` | View announcements, download resources. |

---

## Security Deep Dive

This project was built from the ground up with security in mind.

-   **Authentication & Authorization:** Implemented in `authController.js` and `authMiddleware.js`. `bcrypt` hashing is handled in the `User.js` model, ensuring separation of concerns. The RBAC middleware is a flexible function that protects routes by checking the `role` field inside the verified JWT payload.
-   **Data Protection:** The most sensitive data (passwords) is hashed at rest. All communication is designed to be over HTTPS in production, protecting data in transit. The CORS policy in `server.js` restricts API access to only the trusted frontend client.
-   **Input Validation:** `express-validator` is used in the `authRoutes.js` file to create a defense-in-depth strategy, validating data on the server even if client-side checks are bypassed.
-   **Session Management:** JWTs are used for stateless sessions. Tokens are configured with a short expiration time (`1h`) to limit their validity. The frontend `AuthContext` verifies this expiration before using a stored token.
-   **Error Handling:** The `errorMiddleware.js` file contains a global error handler that catches all server errors, logs them for developers, and sends a generic, non-revealing message to the client, preventing information leakage.

## License

This project is licensed under the MIT License.