import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { auth, authClient } from './auth-client';
import { useSyncStore } from '../state/bridge';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ehubgo.onrender.com/api/v1';

const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(async config => {
  // Check for backend token first
  const backendToken = await SecureStore.getItemAsync('backend_token');
  if (backendToken) {
    config.headers = {
        ...(config.headers as Record<string, string>),
        Authorization: `Bearer ${backendToken}`,
    };
    return config;
  }

  // Fallback to Firebase token
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers = {
      ...(config.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

httpClient.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;
    if (status === 401) {
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
