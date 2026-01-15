import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../locales/translations';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Handle navigation to hash anchors
  const handleNavClick = (hash: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first, then scroll
      navigate('/');
      // Wait for navigation and page render to complete, then scroll
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          // Scroll with offset for navbar height
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    } else {
      // If already on home page, just scroll
      const element = document.querySelector(hash);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside
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

  const languages = [
    { code: 'es' as const, name: 'Español', flag: 'ES' },
    { code: 'en' as const, name: 'English', flag: 'EN' },
    { code: 'pt' as const, name: 'Português', flag: 'PT' },
    { code: 'fr' as const, name: 'Français', flag: 'FR' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const navLinks = [
    { name: t.nav.features, href: '#features' },
    { name: t.nav.howItWorks, href: '#how-it-works' },
    { name: t.nav.testimonials, href: '#testimonials' },
    { name: t.nav.contact, href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-md border-b border-border dark:border-slate-700'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/"
              className="text-2xl font-bold text-text-primary dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200"
              aria-label="Helvia Home"
            >
              Helvia
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              // Check if link is a route (starts with /) or a hash anchor
              if (link.href.startsWith('/')) {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white transition-colors duration-200 font-medium text-sm relative group cursor-pointer px-2"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
                  </Link>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href, e)}
                  className="text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white transition-colors duration-200 font-medium text-sm relative group cursor-pointer px-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => {
                toggleDarkMode();
              }}
              className="ml-2 p-2 rounded-lg hover:bg-[#F8FAF9] dark:hover:bg-slate-800 transition-colors duration-200 text-text-secondary dark:text-slate-300 cursor-pointer"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {/* Language Selector */}
            <div className="relative ml-2" ref={languageDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F8FAF9] dark:hover:bg-slate-800 transition-colors duration-200 text-text-secondary dark:text-slate-300 cursor-pointer text-sm font-medium"
                aria-label="Select language"
                aria-expanded={isLanguageDropdownOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden sm:inline">{currentLanguage.flag}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-slate-800 rounded-lg shadow-xl border-2 border-border dark:border-slate-700 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 flex items-center gap-3 ${
                        language === lang.code
                          ? 'bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary font-semibold'
                          : 'text-text-secondary dark:text-slate-300 hover:bg-[#F8FAF9] dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-xs w-8">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <svg className="w-4 h-4 ml-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="ml-4 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-hover transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 bg-card dark:bg-slate-800 text-text-primary dark:text-white px-6 py-2.5 rounded-lg font-semibold text-sm border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary-soft dark:hover:bg-primary/20 transition-all duration-200"
                >
                  {t.dashboard.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="ml-4 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-hover transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  {t.nav.register}
                </Link>
                <Link
                  to="/login"
                  className="ml-2 bg-card dark:bg-slate-800 text-text-primary dark:text-white px-6 py-2.5 rounded-lg font-semibold text-sm border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary-soft dark:hover:bg-primary/20 transition-all duration-200"
                >
                  {t.nav.login}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                toggleDarkMode();
              }}
              className="p-2 rounded-lg hover:bg-[#F8FAF9] dark:hover:bg-slate-800 transition-colors duration-200 text-text-primary dark:text-white cursor-pointer"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-primary dark:text-white p-2 rounded-lg hover:bg-[#F8FAF9] dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

          {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card dark:bg-slate-900 border-t border-border dark:border-slate-700 animate-in slide-in-from-top">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => {
              // Check if link is a route (starts with /) or a hash anchor
              if (link.href.startsWith('/')) {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-[#F8FAF9] dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href, e)}
                  className="block px-3 py-2.5 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-[#F8FAF9] dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
                >
                  {link.name}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => {
                toggleDarkMode();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-[#F8FAF9] dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 font-medium text-left cursor-pointer"
            >
              {isDarkMode ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Modo claro
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Modo oscuro
                </>
              )}
            </button>
            {/* Language Selector Mobile */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white hover:bg-[#F8FAF9] dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 font-medium text-left cursor-pointer"
                aria-label="Select language"
                aria-expanded={isLanguageDropdownOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="flex-1">{currentLanguage.name}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLanguageDropdownOpen && (
                <div className="mt-2 w-full bg-card dark:bg-slate-800 rounded-lg shadow-xl border-2 border-border dark:border-slate-700 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 flex items-center gap-3 ${
                        language === lang.code
                          ? 'bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary font-semibold'
                          : 'text-text-secondary dark:text-slate-300 hover:bg-[#F8FAF9] dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-xs w-8">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <svg className="w-4 h-4 ml-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-center hover:bg-primary-hover transition-all duration-200 shadow-sm cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block mt-2 w-full bg-card dark:bg-slate-800 text-text-primary dark:text-white px-5 py-2.5 rounded-lg font-semibold text-center border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary-soft dark:hover:bg-primary/20 transition-all duration-200"
                >
                  {t.dashboard.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-center hover:bg-primary-hover transition-all duration-200 shadow-sm cursor-pointer"
                >
                  {t.nav.register}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-2 bg-card dark:bg-slate-800 text-text-primary dark:text-white px-5 py-2.5 rounded-lg font-semibold text-center border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary-soft dark:hover:bg-primary/20 transition-all duration-200"
                >
                  {t.nav.login}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
