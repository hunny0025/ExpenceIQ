/**
 * analytics.service.ts
 *
 * Fetches spending analytics from the backend.
 * Mirrors the axios-based pattern established in auth.service.ts.
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach stored token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response Types ─────────────────────────────────────────────────────────

export interface AnalyticsPeriod {
  month: number;
  year: number;
}

export interface AnalyticsSummary {
  totalExpense: number;
  totalIncome: number;
  netSavings: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  total: number;
  count: number;
}

export interface DailyTrendPoint {
  date: string;      // "YYYY-MM-DD"
  total: number;
  count: number;
}

export interface PaymentMethodBreakdown {
  _id: string;
  total: number;
  count: number;
}

export interface AnalyticsData {
  period: AnalyticsPeriod;
  summary: AnalyticsSummary;
  byCategory: CategoryBreakdown[];
  dailyTrend: DailyTrendPoint[];
  byPaymentMethod: PaymentMethodBreakdown[];
}

export interface AnalyticsParams {
  month?: number;
  year?: number;
}

// ─── Service ────────────────────────────────────────────────────────────────

export const analyticsService = {
  /**
   * Fetch analytics for a given month/year.
   * Defaults to current month on the server side if not provided.
   */
  async getAnalytics(params?: AnalyticsParams): Promise<AnalyticsData> {
    const { data } = await api.get<{ success: boolean; data: AnalyticsData }>(
      '/analytics',
      { params },
    );
    return data.data;
  },
};
