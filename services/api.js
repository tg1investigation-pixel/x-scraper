import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configure your backend API URL here
// Use process.env.NODE_ENV for better compatibility, fallback to __DEV__ if available
const isDevelopment = typeof __DEV__ !== 'undefined' 
  ? __DEV__ 
  : (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production');

const API_BASE_URL = isDevelopment
  ? 'http://localhost:3000/api' // Development URL - Update this to your local IP for physical device testing
  : 'https://your-production-api.com/api'; // Production URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      try {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('userInfo');
      } catch (storageError) {
        console.error('Error clearing secure storage:', storageError);
      }
    } else if (!error.response) {
      // Network error or no response
      console.error('Network error:', error.message);
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data || {};
      
      if (!token) {
        return {
          success: false,
          error: 'Invalid response from server. Please try again.',
        };
      }
      
      // Store token securely
      await SecureStore.setItemAsync('authToken', token);
      if (user) {
        await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
      }
      
      return { success: true, user, token };
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Login failed. Please check your credentials and connection.';
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  async logout() {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userInfo');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const userInfo = await SecureStore.getItemAsync('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  },
};

export const searchService = {
  async searchPeople(query, searchType) {
    try {
      const response = await api.post('/search/people', {
        query: query.trim(),
        searchType, // 'phone' or 'name'
      });
      return {
        success: true,
        data: response.data?.results || [],
        total: response.data?.total || 0,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Search failed. Please check your connection and try again.';
      return {
        success: false,
        error: errorMessage,
        data: [],
      };
    }
  },

  async searchVehicles(query) {
    try {
      const response = await api.post('/search/vehicles', {
        query: query.trim(),
      });
      return {
        success: true,
        data: response.data?.results || [],
        total: response.data?.total || 0,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Vehicle search failed. Please check your connection and try again.';
      return {
        success: false,
        error: errorMessage,
        data: [],
      };
    }
  },

  async getRecordDetails(recordId, recordType) {
    try {
      const response = await api.get(`/records/${recordId}`, {
        params: { type: recordType },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load record details.',
      };
    }
  },
};

export default api;
