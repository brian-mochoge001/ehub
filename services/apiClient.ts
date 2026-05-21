import { auth, authClient } from './auth-client';
import { useSyncStore } from '../state/bridge';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ehubgo.onrender.com/api/v1';

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
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_URL}${endpoint}`;
    
    // Auto retry mechanism (up to 2 retries for network errors or 5xx)
    let retries = 2;
    while (retries >= 0) {
      try {
        const response = await fetch(url, { ...options, headers });
        
        if (!response.ok) {
          if (response.status === 401) {
              await authClient.signOut();
              useSyncStore.getState().clearSyncState();
          }
          if (response.status >= 500 && retries > 0) {
            retries--;
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          const errorData = await response.json().catch(() => null);
          throw new ApiError(response.status, errorData?.message || `HTTP Error ${response.status}`, errorData);
        }
        
        // Handle empty responses
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {} as T;
        }

        return await response.json();
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        if (retries > 0) {
          retries--;
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        throw new Error(`Network error or failed to fetch: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    throw new Error('Failed to complete request after retries');
  },

  get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T = any>(endpoint: string, data: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T = any>(endpoint: string, data: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};
