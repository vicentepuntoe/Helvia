import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../locales/translations';

const IntegrationsSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const integrations = [
    {
      name: 'WhatsApp',
      description: t.dashboard.whatsappDesc,
      icon: '💬',
      enabled: false,
    },
    {
      name: 'Email',
      description: t.dashboard.emailDesc,
      icon: '📧',
      enabled: false,
    },
    {
      name: 'Chat Web',
      description: t.dashboard.webChatDesc,
      icon: '🌐',
      enabled: false,
    },
    {
      name: 'API',
      description: t.dashboard.apiDesc,
      icon: '🔌',
      enabled: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-2">{t.dashboard.integrationsTitle}</h2>
        <p className="text-text-secondary dark:text-slate-400">
          {t.dashboard.integrationsSubtitle}
        </p>
      </div>

      {/* Plan Plus Message */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-2 border-primary/30 dark:border-primary/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
              {t.dashboard.upgradePlanTitle}
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-400 mb-4">
              {t.dashboard.upgradePlanDesc}
            </p>
            <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
              {t.dashboard.upgradePlanButton}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, idx) => (
          <div
            key={idx}
            className="bg-card dark:bg-slate-800 p-6 rounded-xl border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-white">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-slate-400">
                    {integration.description}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={integration.enabled} readOnly />
                <div className="w-11 h-6 bg-border dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <button
              disabled={!integration.enabled}
              className="w-full px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.dashboard.configure}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSection;
