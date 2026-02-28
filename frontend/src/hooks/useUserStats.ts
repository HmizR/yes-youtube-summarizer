import { useState, useEffect } from 'react';
import { userApi } from '@/services/api';

export interface UserStats {
  user: {
    id: string;
    username: string;
    email: string;
    summaries_created: number;
    total_time_saved: number;
    total_words_saved: number;
    subscription_plan: string;
    monthly_limit: number;
    used_this_month: number;
    remaining_this_month: number;
  };
  statistics: {
    total_summaries: number;
    by_category: Record<string, number>;
    by_status: {
      processing: number;
      completed: number;
      failed: number;
    };
    monthly_usage: number;
  };
  recent_activity: Array<{
    id: string;
    video_title: string;
    status: string;
    created_at: string;
    processing_time: number;
  }>;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await userApi.getUserStats();
      setStats(data.data);
    } catch (err: any) {
      setError(err.error || 'Failed to fetch user stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};