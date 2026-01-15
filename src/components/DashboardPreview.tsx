import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

const DashboardPreview = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  // Type assertion to help TypeScript recognize all dashboard properties
  const dashboard = t.dashboard as typeof t.dashboard & {
    stats1Label: string;
    stats2Label: string;
    stats3Label: string;
    stats4Label: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    everythingInOnePlace: string;
    everythingInOnePlaceDesc: string;
    featureMultiChannel: string;
    feature24_7: string;
    featureTeamCollaboration: string;
    customerLabel: string;
    customerMessage: string;
    helviaResponse: string;
  };

  const stats = [
    { label: dashboard.stats1Label, value: '143.683' },
    { label: dashboard.stats2Label, value: '2.3 min' },
    { label: dashboard.stats3Label, value: '40%' },
    { label: dashboard.stats4Label, value: '94%' },
  ];

  const steps = [
    {
      number: '01',
      title: dashboard.step1Title,
      description: dashboard.step1Desc,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: dashboard.step2Title,
      description: dashboard.step2Desc,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: dashboard.step3Title,
      description: dashboard.step3Desc,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      number: '04',
      title: dashboard.step4Title,
      description: dashboard.step4Desc,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-card dark:bg-slate-800 p-4 sm:p-6 lg:p-8 rounded-xl border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-slate-400 mb-2 sm:mb-3 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 line-clamp-2">{stat.label}</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-text-primary dark:text-white mb-3 sm:mb-4">
            {dashboard.howItWorksTitle}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 max-w-2xl mx-auto px-4">
            {dashboard.howItWorksSubtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-card dark:bg-slate-800 p-6 sm:p-8 rounded-xl border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <span className="text-2xl font-bold text-text-secondary dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-text-secondary dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="bg-card dark:bg-slate-800 rounded-xl shadow-xl border-2 border-border dark:border-slate-700 p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary dark:text-white mb-3 sm:mb-4">
                {dashboard.everythingInOnePlace}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-text-secondary dark:text-slate-300 leading-relaxed mb-4 sm:mb-6">
                {dashboard.everythingInOnePlaceDesc}
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  dashboard.featureMultiChannel,
                  dashboard.feature24_7,
                  dashboard.featureTeamCollaboration,
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-text-secondary dark:text-slate-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="break-words">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#F8FAF9] dark:bg-slate-900 rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-border dark:border-slate-700">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-soft dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-text-primary dark:text-white font-medium mb-1">
                      {dashboard.customerLabel}
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 break-words">
                      {dashboard.customerMessage}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">H</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-text-primary dark:text-white font-medium mb-1">{dashboard.helviaLabel || 'Helvia'}</p>
                    <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 break-words">
                      {dashboard.helviaResponse}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
