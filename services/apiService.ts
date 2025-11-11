import axios from 'axios';
import { Announcement, Resource, User } from '../types';

// 🔒 Security: Create an Axios instance with the base URL from environment variables.
// This is safer and more maintainable than hardcoding the URL in every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔒 Security: Use an Axios interceptor to automatically add the JWT to every request header.
// This is a critical security practice that centralizes authentication logic and ensures
// that no authenticated request is ever sent without a token. It's more secure
// and reliable than adding the header manually to each API call.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// --- AUTHENTICATION ---
export const apiLogin = async (username: string, password: string): Promise<{ user: User, token: string }> => {
  const response = await api.post('/api/auth/login', { username, password });
  const { _id: id, ...userProps } = response.data;
  return { user: { id, ...userProps }, token: response.data.token };
};


// --- ANNOUNCEMENTS ---
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await api.get('/api/announcements');
  return response.data;
};

export const createAnnouncement = async (title: string, content: string): Promise<Announcement> => {
    const response = await api.post('/api/announcements', { title, content });
    return response.data;
};


// --- RESOURCES ---
export const getResources = async (): Promise<Resource[]> => {
    const response = await api.get('/api/resources');
    return response.data;
};

export const uploadResource = async (file: File): Promise<Resource> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/resources/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 🔒 Security: Programmatically downloads a file by making an authenticated API request.
// Instead of a simple <a href="..."> link (which cannot send Authorization headers),
// this function uses Axios to fetch the file as a blob. This ensures the user is
// authenticated and authorized to download the file, enforcing backend security rules.
export const downloadResourceFile = async (resourceId: string, filename: string) => {
    try {
        const response = await api.get(`/api/resources/download/${resourceId}`, {
            responseType: 'blob', // Important: tells Axios to expect binary data
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download file. You may not have permission or the file is missing.");
    }
};