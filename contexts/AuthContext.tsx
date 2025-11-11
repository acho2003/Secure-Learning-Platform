import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { apiLogin } from '../services/apiService';
import { jwtDecode } from 'jwt-decode';


interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode a real JWT
interface DecodedToken {
  id: string;
  username: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        const decodedToken: DecodedToken = jwtDecode(storedToken);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({ id: decodedToken.id, username: decodedToken.username, role: decodedToken.role, email: '' }); // Email isn't in token, but it's fine for context
          setToken(storedToken);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await apiLogin(username, password);
      if (response && response.token) {
        const loggedInUser = response.user;
        setUser(loggedInUser);
        setToken(response.token);
        localStorage.setItem('authToken', response.token);
        return loggedInUser;
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};