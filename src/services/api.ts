import axios from 'axios';
import { Root, RootCreate, RootUpdate } from '../types/root';
import { Translation, TranslationCreate, TranslationUpdate } from '../types/translation';

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

export const translationsApi = {
  getAll: async (): Promise<Translation[]> => {
    const response = await api.get<Translation[]>('/translations');
    return response.data;
  },

  getById: async (id: string): Promise<Translation> => {
    const response = await api.get<Translation>(`/translations/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<Translation[]> => {
    const response = await api.get<Translation[]>(`/translations/search?q=${query}`);
    return response.data;
  },

  getByRoot: async (root: string): Promise<Translation[]> => {
    const response = await api.get<Translation[]>(`/translations/by-root/${root}`);
    return response.data;
  },

  create: async (data: TranslationCreate): Promise<Translation> => {
    const response = await api.post<Translation>('/translations', data);
    return response.data;
  },

  update: async (id: string, data: TranslationUpdate): Promise<Translation> => {
    const response = await api.put<Translation>(`/translations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/translations/${id}`);
  },
};

export default api;
