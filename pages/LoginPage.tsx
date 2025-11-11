import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318-5.318m0 0a3 3 0 10-4.243-4.243m4.243 4.243l4.242-4.242" />
  </svg>
);

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // 🔒 Security: Authentication logic is abstracted into the useAuth hook.
  // This centralizes authentication logic, making it easier to manage and audit for security flaws,
  // rather than scattering it across different components.
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 🔒 Security: Basic client-side input validation.
    // While the primary, authoritative validation happens on the backend, this check provides
    // immediate feedback to the user and prevents unnecessary API requests with invalid data.
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    
    // 🔒 Security: Use a try/catch block for robust error handling.
    // This ensures that any unexpected failures during the login process are caught gracefully
    // and do not crash the application or expose sensitive error details.
    try {
      const user = await login(username, password);
      if (user) {
        // Redirect based on role after successful login
        const redirectPath = from || `/${user.role}`;
        navigate(redirectPath, { replace: true });
      } else {
        // 🔒 Security: Display a generic error message upon login failure.
        // This is a critical security measure to prevent user enumeration attacks.
        // The message does not reveal whether the username was invalid or if only the password was incorrect.
        setError('Invalid username or password.');
      }
    } catch (err) {
      // 🔒 Security: Catch-all for network errors or other unexpected issues.
      // Again, a generic message protects against leaking implementation details.
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <ShieldIcon />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Secure Learning Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            ELE201 - Secure Coding
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                // 🔒 Security: Use 'autoComplete="username"' to help password managers identify the correct field.
                // This encourages users to use stronger, unique passwords managed by a trusted tool.
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username (admin, instructor, or student)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                name="password"
                // 🔒 Security: Input type is set to "password".
                // This masks the input, preventing shoulder-surfing attacks where an attacker
                // could see the user's password on the screen.
                type="password"
                // 🔒 Security: 'autoComplete="current-password"' is the correct attribute for a login form password.
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password (e.g., password123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              // 🔒 Security: Disable the submit button during the login process.
              // This prevents users from sending multiple simultaneous login requests,
              // which can mitigate some risks of race conditions or server overload.
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;