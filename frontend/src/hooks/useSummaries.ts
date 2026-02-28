import { useState, useCallback } from 'react';
import { summaryApi } from '@/services/api';

export interface Summary {
  id: string;
  video_id: string;
  video_title: string;
  channel_name: string;
  thumbnail_url: string;
  duration: string;
  summary: string;
  key_points: string[];
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  reduction_percentage: number;
  original_word_count: number;
  summary_word_count: number;
}

export const useSummaries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSummary = useCallback(async (videoUrl: string, options?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await summaryApi.createSummary(videoUrl, options);
      return response;
    } catch (err: any) {
      setError(err.error || 'Failed to create summary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSummaries = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await summaryApi.getSummaries(params);
      return response;
    } catch (err: any) {
      setError(err.error || 'Failed to fetch summaries');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createSummary,
    getSummaries,
    loading,
    error,
  };
};