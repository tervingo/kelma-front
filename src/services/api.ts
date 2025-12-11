import axios from 'axios';
import { Root, RootCreate, RootUpdate } from '../types/root';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const rootsApi = {
  getAll: async (): Promise<Root[]> => {
    const response = await api.get<Root[]>('/roots');
    return response.data;
  },

  getById: async (id: string): Promise<Root> => {
    const response = await api.get<Root>(`/roots/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<Root[]> => {
    const response = await api.get<Root[]>(`/roots/search?q=${query}`);
    return response.data;
  },

  create: async (data: RootCreate): Promise<Root> => {
    const response = await api.post<Root>('/roots', data);
    return response.data;
  },

  update: async (id: string, data: RootUpdate): Promise<Root> => {
    const response = await api.put<Root>(`/roots/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/roots/${id}`);
  },
};

export default api;
