import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../locales/translations';

const TeamSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-2">{t.dashboard.teamTitle}</h2>
        <p className="text-text-secondary dark:text-slate-400">
          {t.dashboard.teamSubtitle}
        </p>
      </div>

      <div className="bg-card dark:bg-slate-800 p-8 rounded-xl border-2 border-border dark:border-slate-700">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2">
            {t.dashboard.teamTitle}
          </h3>
          <p className="text-text-secondary dark:text-slate-400 max-w-md mx-auto">
            {t.dashboard.teamDescription}
          </p>
          <p className="text-sm text-text-secondary dark:text-slate-400 mt-4">
            {t.dashboard.comingSoon}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
