/**
 * useAnalytics.ts
 *
 * Custom hook to fetch analytics data from the API.
 * Exposes loading, error, and data states for consumption by chart components.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  analyticsService,
  type AnalyticsData,
  type AnalyticsParams,
} from '../services/analytics.service';

export interface UseAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalytics(params?: AnalyticsParams): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serialize params so useEffect reacts to value changes, not ref changes
  const month = params?.month;
  const year = params?.year;

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        const result = await analyticsService.getAnalytics({ month, year });

        // Don't update state if we were cancelled
        if (signal?.aborted) return;

        setData(result);
      } catch (err: unknown) {
        if (signal?.aborted) return;

        // Axios wraps the server message in err.response.data.message
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ??
          (err instanceof Error ? err.message : 'Failed to load analytics');

        setError(message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [month, year],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
