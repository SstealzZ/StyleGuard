import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';
import i18n from 'i18next';

/**
 * API error response with code and message
 * Used for communicating error details between services and components
 */
export interface ApiErrorResponse {
  key: string;
  isOllamaError?: boolean;
}

/**
 * Base API configuration for StyleGuard
 */
export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000, // 15 seconds timeout
});

/**
 * Sets the authentication token for API requests
 * 
 * @param token - JWT token to use for authentication
 */
export const setAuthToken = (token: string): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const store = useAuthStore.getState();

    console.error('Response error interceptor:', error.message);

    if (error.response?.status === 401 && !originalRequest._retry && store.token && store.refreshToken) {
      originalRequest._retry = true;

      try {
        // Effectuer l'appel pour rafraîchir le token
        const response = await api.post('/auth/refresh', {
          refresh_token: store.refreshToken
        });
        
        const authData = response.data;
        if (authData && authData.access_token) {
          // Mettre à jour le token
          store.setAuthData(authData);
          
          // Relancer la requête originale avec le nouveau token
          originalRequest.headers['Authorization'] = `Bearer ${authData.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        store.clearState();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      store.clearState();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

/**
 * Interface for correction request
 */
export interface CorrectionRequest {
  original_text: string;
  language?: string;
}

/**
 * Interface for correction response
 */
export interface CorrectionResponse {
  id: number;
  original_text: string;
  corrected_text: string;
  created_at: string;
  user_id: number;
}

/**
 * Extracts custom API error messages
 * 
 * @param error - Axios error object
 * @returns API error response with key and Ollama flag
 */
const extractApiError = (error: unknown): ApiErrorResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.data) {
      const data = axiosError.response.data as any;
      
      // Check for Ollama specific errors and return translation keys
      if (data.detail === 'OLLAMA_CONNECTION_ERROR') {
        return { 
          key: 'ollamaConnectionError',
          isOllamaError: true
        };
      }
      
      if (data.detail === 'OLLAMA_TIMEOUT_ERROR') {
        return { 
          key: 'ollamaTimeoutError',
          isOllamaError: true
        };
      }
      
      if (data.detail === 'OLLAMA_GENERAL_ERROR') {
        return { 
          key: 'ollamaGeneralError',
          isOllamaError: true
        };
      }
      
      // Return standard error detail if available
      if (data.detail) {
        return { key: data.detail };
      }
    }
    
    // Fallback to status text
    if (axiosError.response?.statusText) {
      return { key: axiosError.response.statusText };
    }
  }
  
  // Fallback to generic message
  return { key: 'unexpectedError' };
};

/**
 * Service for handling text corrections
 */
export const correctionService = {
  /**
   * Creates a new correction
   * 
   * @param text - Text to correct
   * @returns Correction response
   */
  createCorrection: async (text: string): Promise<CorrectionResponse> => {
    try {
      console.log('Creating correction with text:', text);
      const request: CorrectionRequest = { original_text: text };
      const response = await api.post<CorrectionResponse>('/corrections/', request);
      console.log('Correction created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating correction:', error);
      const apiError = extractApiError(error);
      throw apiError;
    }
  },

  /**
   * Retrieves user's correction history
   * 
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @returns List of corrections
   */
  getUserCorrections: async (skip = 0, limit = 10): Promise<CorrectionResponse[]> => {
    try {
      const response = await api.get<CorrectionResponse[]>(`/corrections/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting corrections:', error);
      return [];
    }
  },

  /**
   * Retrieves a specific correction
   * 
   * @param id - Correction ID
   * @returns Correction data
   */
  getCorrection: async (id: number): Promise<CorrectionResponse> => {
    try {
      console.log(`Fetching correction with ID: ${id}`);
      const response = await api.get<CorrectionResponse>(`/corrections/${id}`);
      console.log(`Successfully fetched correction: `, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting correction ${id}:`, error);
      const apiError = extractApiError(error);
      throw apiError;
    }
  },

  /**
   * Deletes a correction
   * 
   * @param id - Correction ID to delete
   */
  deleteCorrection: async (id: number): Promise<void> => {
    try {
      await api.delete(`/corrections/${id}`);
    } catch (error) {
      console.error(`Error deleting correction ${id}:`, error);
      const apiError = extractApiError(error);
      throw apiError;
    }
  },
}; 