import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor: attach JWT token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Note: In Appwrite we use sessions, but the prompt asks for JWT from localStorage
    // We'll look for 'vastraya-admin-token'
    const token = typeof window !== 'undefined' ? localStorage.getItem('vastraya-admin-token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    };

    if (error.response) {
      // Server responded with an error
      const data = error.response.data as any;
      apiError.message = data.detail || data.message || `Error: ${error.response.status}`;
      
      if (error.response.status === 401) {
        localStorage.removeItem('vastraya-admin-token');
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = 'Server is unreachable. Please check your connection.';
    } else {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
