import { useAnalytics } from '../../hooks/useAnalytics';
import { useConversations } from '../../hooks/useConversations';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../locales/translations';

const AnalyticsSection = () => {
  const { loading } = useAnalytics();
  const { conversations } = useConversations();
  const { language } = useLanguage();
  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary dark:text-slate-400">{t.dashboard.loadingMessages}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: t.dashboard.totalConversations,
      value: conversations.length.toString(),
      icon: '💬',
    },
    {
      label: t.dashboard.averageResponseTime,
      value: '1.2s',
      icon: '⏱️',
    },
    {
      label: t.dashboard.averageSatisfaction,
      value: '4.7/5',
      icon: '⭐',
    },
    {
      label: t.dashboard.totalMessages,
      value: conversations.length > 0 ? conversations.length.toString() : '0',
      icon: '📨',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-2">{t.dashboard.analyticsTitle}</h2>
        <p className="text-text-secondary dark:text-slate-400">
          {t.dashboard.analyticsSubtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card dark:bg-slate-800 p-6 rounded-xl border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card dark:bg-slate-800 p-6 rounded-xl border-2 border-border dark:border-slate-700">
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
            {t.dashboard.conversationsPerDay}
          </h3>
          <div className="h-64 flex items-center justify-center text-text-secondary dark:text-slate-400">
            <p>{t.dashboard.chartComingSoon}</p>
          </div>
        </div>
        <div className="bg-card dark:bg-slate-800 p-6 rounded-xl border-2 border-border dark:border-slate-700">
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
            {t.dashboard.responseTimeChart}
          </h3>
          <div className="h-64 flex items-center justify-center text-text-secondary dark:text-slate-400">
            <p>{t.dashboard.chartComingSoon}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
