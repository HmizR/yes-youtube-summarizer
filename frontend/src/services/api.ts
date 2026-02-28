import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API endpoints
export const summaryApi = {
  // Create summary
  createSummary: (videoUrl: string, options?: any) =>
    api.post('/summaries', { videoUrl, options }),

  // Get summaries with pagination
  getSummaries: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get('/summaries', { params }),

  // Get single summary
  getSummary: (id: string) => api.get(`/summaries/${id}`),

  // Update summary
  updateSummary: (id: string, data: any) => api.put(`/summaries/${id}`, data),

  // Delete summary
  deleteSummary: (id: string) => api.delete(`/summaries/${id}`),

  // Export summary
  exportSummary: (id: string, format: string) =>
    api.get(`/summaries/${id}/export/${format}`),

  // Get public summaries
  getPublicSummaries: (params?: { page?: number; limit?: number }) =>
    api.get('/summaries/public', { params }),
};

export const authApi = {
  // Register
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  // Login
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  // Logout
  logout: () => api.get('/auth/logout'),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),

  // Update profile
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const userApi = {
  // Get user stats
  getUserStats: () => api.get('/users/stats'),

  // Get API keys
  getApiKeys: () => api.get('/users/api-keys'),

  // Generate API key
  generateApiKey: (data: { name?: string; rate_limit?: number }) =>
    api.post('/users/api-keys', data),

  // Revoke API key
  revokeApiKey: (id: string) => api.put(`/users/api-keys/${id}/revoke`),

  // Update subscription
  updateSubscription: (plan: string) =>
    api.put('/users/subscription', { plan }),

  // Get analytics
  getAnalytics: (period?: string) =>
    api.get('/users/analytics', { params: { period } }),
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export default api;