import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

/**
 * useService hook provides a standardized connector for interacting with miniservices
 * registered in the backend orchestrator.
 */
export function useService<T = any>(serviceId: string, _options?: { staleTime?: number; enabled?: boolean }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.get<T>(`/services/${serviceId}/details`);
      setData(result);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch service details');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      return await apiClient.post(`/services/${serviceId}/transaction`, payload);
    } catch (e: any) {
      setError(e.message || 'Failed to create transaction');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  return { data, loading, error, createTransaction, refresh: fetchServiceDetails };
}
