const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = {
  getHubs: async () => {
    const response = await fetch(`${API_URL}/hubs`);
    if (!response.ok) throw new Error('Failed to fetch hubs');
    return response.json();
  },
  createHub: async (name: string, description: string) => {
    const response = await fetch(`${API_URL}/hubs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Math.random().toString(36).substr(2, 9), name, description }),
    });
    if (!response.ok) throw new Error('Failed to create hub');
    return response.json();
  },
  getTasks: async () => {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },
  createTask: async (title: string, priority: number) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },
};
