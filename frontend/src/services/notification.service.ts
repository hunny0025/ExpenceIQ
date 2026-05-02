import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach stored token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
}

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

interface NotificationResponse {
  success: boolean;
  data: Notification;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data } = await api.get<NotificationsResponse>('/notifications');
    return data.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const { data } = await api.patch<NotificationResponse>(
      `/notifications/${id}/read`,
    );
    return data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },
};
