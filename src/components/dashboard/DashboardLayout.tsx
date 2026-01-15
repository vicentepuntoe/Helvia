import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { translations, type Language } from '../../locales/translations';
import { useState, useRef, useEffect } from 'react';

type DashboardView = 'chat' | 'conversations' | 'analytics' | 'team' | 'integrations' | 'settings';

interface DashboardLayoutProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ activeView, setActiveView, children }) => {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const t = translations[language];
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  const menuItems = [
    { id: 'chat' as DashboardView, label: t.dashboard.chat, icon: '💬' },
    { id: 'conversations' as DashboardView, label: t.dashboard.conversations, icon: '📋' },
    { id: 'analytics' as DashboardView, label: t.dashboard.analytics, icon: '📊' },
    { id: 'team' as DashboardView, label: t.dashboard.team, icon: '👥' },
    { id: 'integrations' as DashboardView, label: t.dashboard.integrations, icon: '🔌' },
    { id: 'settings' as DashboardView, label: t.dashboard.settings, icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card dark:bg-slate-800 border-b border-border dark:border-slate-700 z-40">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold text-text-primary dark:text-white hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
            >
              Helvia
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-text-secondary dark:text-slate-400">
              <span>{user?.email}</span>
            </div>
            
            {/* Language Selector */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="p-2 rounded-lg hover:bg-[#F8FAF9] dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2"
                aria-label={t.dashboard.selectLanguage}
              >
                <span className="text-lg">
                  {languages.find(l => l.code === language)?.flag || '🌐'}
                </span>
                <span className="hidden md:inline text-sm text-text-secondary dark:text-slate-300 font-medium">
                  {languages.find(l => l.code === language)?.code.toUpperCase() || language.toUpperCase()}
                </span>
                <svg className="w-4 h-4 text-text-secondary dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-slate-800 border-2 border-border dark:border-slate-700 rounded-lg shadow-lg z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F8FAF9] dark:hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        language === lang.code
                          ? 'bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary'
                          : 'text-text-primary dark:text-white'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      {language === lang.code && (
                        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-[#F8FAF9] dark:hover:bg-slate-700 transition-colors duration-200"
              aria-label={t.dashboard.toggleDarkMode}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-text-secondary dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text-secondary dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-text-secondary dark:bg-slate-700 text-white text-sm font-medium hover:bg-text-primary dark:hover:bg-slate-600 transition-colors duration-200"
            >
              {t.dashboard.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-card dark:bg-slate-800 border-r border-border dark:border-slate-700 overflow-y-auto z-30">
          <nav className="p-4 space-y-2 w-full">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  activeView === item.id
                    ? 'bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary border border-primary/20 dark:border-primary/30'
                    : 'text-text-secondary dark:text-slate-400 hover:bg-[#F8FAF9] dark:hover:bg-slate-700 hover:text-text-primary dark:hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <div className="bg-primary text-white rounded-full p-4 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
