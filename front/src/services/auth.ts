import { api, setAuthToken } from './api';
import { useAuthStore } from '@/stores/auth';
import { AxiosError } from 'axios';

/**
 * Interface for login request
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interface for register request
 */
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

/**
 * Interface for user data
 */
export interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * Interface for authentication response
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

/**
 * Service for handling authentication
 */
export const authService = {
  /**
   * Registers a new user
   * 
   * @param data - Registration data
   * @returns User data
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Logs in a user
   * 
   * @param credentials - Login credentials
   * @returns Access token and user data
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token } = response.data;
    
    // Set the token before making authenticated requests
    setAuthToken(access_token);
    
    const userResponse = await api.get('/auth/me');

    const authData = {
      access_token,
      refresh_token,
      user: userResponse.data,
    };

    useAuthStore.getState().setAuthData(authData);
    return authData;
  },

  /**
   * Logs out the current user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAuthToken('');
      useAuthStore.getState().clearState();
      window.location.href = '/login';
    }
  },

  /**
   * Gets the current user's data
   * 
   * @returns User data or null if not authenticated
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        useAuthStore.getState().clearState();
      }
      return null;
    }
  },

  /**
   * Refreshes the authentication token
   * 
   * @returns New auth data or null if refresh fails
   */
  refreshToken: async (): Promise<AuthResponse | null> => {
    try {
      const response = await api.post('/auth/refresh');
      const authData = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        user: response.data.user,
      };
      setAuthToken(authData.access_token);
      useAuthStore.getState().setAuthData(authData);
      return authData;
    } catch (error) {
      setAuthToken('');
      useAuthStore.getState().clearState();
      return null;
    }
  },
}; 