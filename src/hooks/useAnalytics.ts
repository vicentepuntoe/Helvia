import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAnalytics, createAnalytics, type Analytics } from '../lib/supabase-tables';

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserAnalytics(user.id);
      setAnalytics(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAnalytics = async (analyticsData: Omit<Analytics, 'id' | 'created_at'>) => {
    if (!user) return null;
    
    try {
      const newAnalytics = await createAnalytics({
        ...analyticsData,
        user_id: user.id,
      });
      setAnalytics((prev) => [newAnalytics, ...prev]);
      return newAnalytics;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating analytics:', err);
      throw err;
    }
  };

  // Calculated metrics
  const metrics = {
    totalConversations: analytics.length,
    averageResponseTime: analytics.length > 0
      ? Math.round(
          analytics
            .filter((a) => a.response_time_ms !== null)
            .reduce((sum, a) => sum + (a.response_time_ms || 0), 0) /
            analytics.filter((a) => a.response_time_ms !== null).length
        )
      : 0,
    averageSatisfaction: analytics.length > 0
      ? Math.round(
          analytics
            .filter((a) => a.satisfaction_score !== null)
            .reduce((sum, a) => sum + (a.satisfaction_score || 0), 0) /
            analytics.filter((a) => a.satisfaction_score !== null).length
        )
      : 0,
  };

  return {
    analytics,
    loading,
    error,
    addAnalytics,
    refreshAnalytics: loadAnalytics,
    metrics,
  };
};
