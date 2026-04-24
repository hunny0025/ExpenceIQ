import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach stored token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  currency: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post<{ success: boolean; data: AuthUser }>('/auth/login', payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const { data } = await api.post<{ success: boolean; data: AuthUser }>('/auth/register', payload);
    return data.data;
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await api.get<{ success: boolean; data: AuthUser }>('/auth/me');
    return data.data;
  },
};
