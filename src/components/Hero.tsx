import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { translations } from '../locales/translations';

const Hero = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const t = translations[language];
  
  // Set default color theme (Verde)
  const defaultTheme = { primary: '#16A34A', primaryHover: '#15803D', primarySoft: '#DCFCE7' };
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--chat-primary', defaultTheme.primary);
    document.documentElement.style.setProperty('--chat-primary-hover', defaultTheme.primaryHover);
    document.documentElement.style.setProperty('--chat-primary-soft', defaultTheme.primarySoft);
  }

  const benefits = [
    { text: t.hero.benefit1 },
    { text: t.hero.benefit2 },
    { text: t.hero.benefit3 },
  ];

  return (
    <section className="pt-20 pb-6 sm:pt-28 sm:pb-8 lg:pt-36 lg:pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-semibold text-primary dark:text-primary">{t.hero.badge}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
              {t.hero.title}<br className="hidden sm:block" /> {t.hero.titleLine2}
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <a
                href="#how-it-works"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto text-center"
              >
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#features"
                className="bg-card dark:bg-slate-800 text-text-primary dark:text-white px-8 py-4 rounded-lg font-semibold text-base border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary-soft dark:hover:bg-primary/20 transition-all duration-200 w-full sm:w-auto text-center"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>

            {/* Benefits List */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary dark:text-slate-400">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard Chat Preview */}
          <div className="relative hidden lg:block">
            <div className="relative max-w-md mx-auto">
              {/* Dashboard Chat Mockup */}
              <div className="bg-card dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-border dark:border-slate-700 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Chat Header */}
                <div className="p-4 border-b border-border dark:border-slate-700 flex items-center gap-3 bg-card dark:bg-slate-800">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm transition-all duration-300 flex-shrink-0"
                    style={{ 
                      backgroundColor: 'var(--chat-primary)',
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}
                  >
                    H
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary dark:text-white text-sm">Helvia</div>
                    <div className="text-xs text-text-secondary dark:text-slate-400">{t.hero.chatOnline}</div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div 
                  className="px-4 py-4 space-y-4 min-h-[400px]"
                  style={{ backgroundColor: isDarkMode ? '#0F172A' : '#F8FAF9' }}
                >
                  {/* Customer Message - First */}
                  <div className="flex items-end gap-3 justify-end">
                    <div
                      className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm"
                      style={{
                        fontSize: '14px',
                        borderRadius: '16px',
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        color: isDarkMode ? '#FFFFFF' : '#0F172A',
                      }}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words text-sm">{t.hero.chatMessage1}</p>
                      <span 
                        className="text-text-secondary dark:text-slate-400 block mt-2 text-right"
                        style={{ fontSize: '8px' }}
                      >
                        10:32 AM
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                      U
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-end gap-3 justify-start">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: 'var(--chat-primary)' }}
                    >
                      H
                    </div>
                    <div
                      className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm"
                      style={{
                        fontSize: '14px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--chat-primary-soft)',
                        color: '#0F172A',
                      }}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words text-sm">{t.hero.chatResponse1}</p>
                      <span 
                        className="text-text-secondary dark:text-slate-400 block mt-2"
                        style={{ fontSize: '8px' }}
                      >
                        10:32 AM
                      </span>
                    </div>
                  </div>

                  {/* Customer Message */}
                  <div className="flex items-end gap-3 justify-end">
                    <div
                      className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm"
                      style={{
                        fontSize: '14px',
                        borderRadius: '16px',
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        color: isDarkMode ? '#FFFFFF' : '#0F172A',
                      }}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words text-sm">{t.hero.chatMessage2}</p>
                      <span 
                        className="text-text-secondary dark:text-slate-400 block mt-2 text-right"
                        style={{ fontSize: '8px' }}
                      >
                        10:33 AM
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                      U
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-end gap-3 justify-start">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: 'var(--chat-primary)' }}
                    >
                      H
                    </div>
                    <div
                      className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm"
                      style={{
                        fontSize: '14px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--chat-primary-soft)',
                        color: '#0F172A',
                      }}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words text-sm">{t.hero.chatResponse2}</p>
                      <span 
                        className="text-text-secondary dark:text-slate-400 block mt-2"
                        style={{ fontSize: '8px' }}
                      >
                        10:33 AM
                      </span>
                    </div>
                  </div>

                  {/* Customer Message */}
                  <div className="flex items-end gap-3 justify-end">
                    <div
                      className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm"
                      style={{
                        fontSize: '14px',
                        borderRadius: '16px',
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        color: isDarkMode ? '#FFFFFF' : '#0F172A',
                      }}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words text-sm">{t.hero.chatMessage3}</p>
                      <span 
                        className="text-text-secondary dark:text-slate-400 block mt-2 text-right"
                        style={{ fontSize: '8px' }}
                      >
                        10:34 AM
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                      U
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-end gap-3 justify-start">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: 'var(--chat-primary)' }}
                    >
                      H
                    </div>
                    <div 
                      className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm"
                      style={{ backgroundColor: 'var(--chat-primary-soft)' }}
                    >
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Visual */}
          <div className="lg:hidden mt-8">
            <div className="bg-card dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-border overflow-hidden">
              {/* Chat Header */}
              <div className="p-3 border-b border-border dark:border-slate-700 flex items-center gap-2 bg-card dark:bg-slate-800">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm transition-all duration-300 flex-shrink-0"
                  style={{ 
                    backgroundColor: 'var(--chat-primary)',
                    color: 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  H
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary dark:text-white text-xs">Helvia</div>
                  <div className="text-[10px] text-text-secondary dark:text-slate-400">{t.hero.chatOnline}</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                className="px-2 py-3 space-y-2"
                style={{ backgroundColor: isDarkMode ? '#0F172A' : '#F8FAF9' }}
              >
                {/* Customer Message - First */}
                <div className="flex items-end gap-2 justify-end">
                  <div
                    className="max-w-[80%] rounded-2xl px-3 py-2 shadow-sm"
                    style={{
                      fontSize: '12px',
                      borderRadius: '16px',
                      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#0F172A',
                    }}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap break-words text-xs">{t.hero.chatMobileMessage1}</p>
                    <span 
                      className="text-text-secondary dark:text-slate-400 block mt-1 text-right"
                      style={{ fontSize: '8px' }}
                    >
                      10:32
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    U
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-end gap-2 justify-start">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm transition-all duration-300 flex-shrink-0"
                    style={{ 
                      backgroundColor: 'var(--chat-primary)',
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}
                  >
                    H
                  </div>
                  <div
                    className="max-w-[80%] rounded-2xl px-3 py-2 shadow-sm"
                    style={{
                      fontSize: '12px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--chat-primary-soft)',
                      color: '#0F172A',
                    }}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap break-words text-xs">{t.hero.chatMobileResponse1}</p>
                    <span 
                      className="text-text-secondary dark:text-slate-400 block mt-1"
                      style={{ fontSize: '8px' }}
                    >
                      10:32
                    </span>
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

export default Hero;
