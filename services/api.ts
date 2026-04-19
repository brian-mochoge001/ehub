import { auth } from './auth-client';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const getHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const api = {
  getHubs: async () => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/hubs`, { headers });
    if (!response.ok) throw new Error('Failed to fetch hubs');
    return response.json();
  },
  createHub: async (name: string, description: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/hubs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: Math.random().toString(36).substr(2, 9), name, description }),
    });
    if (!response.ok) throw new Error('Failed to create hub');
    return response.json();
  },
  getTasks: async () => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/tasks`, { headers });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },
  createTask: async (title: string, priority: number) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, priority }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  // Driver / Taxi Methods
  createDriver: async (id: string, name: string, status: string = 'online') => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/drivers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id, name, status }),
    });
    if (!response.ok) throw new Error('Failed to create driver');
    return response.json();
  },
  updateLocation: async (id: string, longitude: number, latitude: number) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/drivers/${id}/location`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ longitude, latitude }),
    });
    if (!response.ok) throw new Error('Failed to update location');
    return response.json();
  },
  getDriverLocation: async (id: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/drivers/${id}/location`, { headers });
    if (!response.ok) throw new Error('Failed to fetch driver location');
    return response.json();
  },
  getNearbyDrivers: async (longitude: number, latitude: number, limit: number = 5) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/drivers/nearby?longitude=${longitude}&latitude=${latitude}&limit=${limit}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch nearby drivers');
    return response.json();
  },
};
