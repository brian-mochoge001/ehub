import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { auth } from './firebaseConfig';
import { useSyncStore } from '../state/bridge';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ehubgo.onrender.com/api/v1';

// Helper to flatten sql.NullString and similar structures from Go
function flattenNulls(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(flattenNulls);
    }
    
    // Handle sql.NullString { String: string, Valid: boolean }
    if ('String' in obj && 'Valid' in obj && typeof obj.Valid === 'boolean') {
        return obj.Valid ? obj.String : null;
    }
    
    // Handle sql.NullInt32, sql.NullFloat64, etc.
    if ('Int32' in obj && 'Valid' in obj) return obj.Valid ? obj.Int32 : null;
    if ('Float64' in obj && 'Valid' in obj) return obj.Valid ? obj.Float64 : null;
    if ('Bool' in obj && 'Valid' in obj) return obj.Valid ? obj.Bool : null;
    if ('Time' in obj && 'Valid' in obj) return obj.Valid ? obj.Time : null;

    const flattened: any = {};
    for (const [key, value] of Object.entries(obj)) {
        flattened[key] = flattenNulls(value);
    }
    return flattened;
}

const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(async config => {
  // Always try to get the latest Firebase token
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.set('Authorization', `Bearer ${token}`);
    } catch (e) {
      console.warn('[API] Failed to get Firebase token', e);
    }
  }
  return config;
});

httpClient.interceptors.response.use(
  response => {
    // Automatically flatten Nulls in response data
    response.data = flattenNulls(response.data);
    return response;
  },
  async error => {
    const status = error?.response?.status;
    if (status === 401) {
      // Import authClient locally to break circular dependency
      const { authClient } = await import('./auth-client');
      await authClient.signOut();
      useSyncStore.getState().clearSyncState();
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  async request<T = any>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const config: AxiosRequestConfig = {
      ...options,
      url: endpoint,
      headers,
    };

    if ('body' in options) {
      config.data = options.body;
    }

    let retries = 2;
    while (true) {
      try {
        const response = await httpClient.request<T>(config);
        return response.data;
      } catch (error: any) {
        const status = error?.response?.status;
        if ((status >= 500 || !status) && retries > 0) {
          retries -= 1;
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        if (status) {
          throw new ApiError(status, error?.response?.data?.message || error.message, error?.response?.data);
        }

        throw new Error(`Network error or failed to fetch: ${error?.message || String(error)}`);
      }
    }
  },

  get<T = any>(endpoint: string, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T = any>(endpoint: string, data: any, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      data,
    });
  },

  put<T = any>(endpoint: string, data: any, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      data,
    });
  },

  delete<T = any>(endpoint: string, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
