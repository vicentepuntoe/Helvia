import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

const CompanyLogos = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const companies = [
    'Corteiz',
    'Google',
    'Walmart',
    'Gymshark',
    'Petazetacl',
    'Doordash',
    'Lululemon',
    'Amazon',
    'Zara',
    'StockX',
    'YoungLA',
    'Essentials',
  ];

  // Duplicate exactly 2 times for perfect seamless loop
  // When we move 50% (one full copy), it loops perfectly
  const allCompanies = [...companies, ...companies];

  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs font-semibold text-text-secondary dark:text-slate-400 mb-12 uppercase tracking-[0.15em] letter-spacing-wider">
          {t.companyLogos.title}
        </p>
        <div className="relative">
          {/* Strong gradient overlays - adjusted for better visibility */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 lg:w-48 bg-gradient-to-r from-[#F8FAF9] dark:from-slate-900 via-[#F8FAF9] dark:via-slate-900 to-transparent z-30 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 lg:w-48 bg-gradient-to-l from-[#F8FAF9] dark:from-slate-900 via-[#F8FAF9] dark:via-slate-900 to-transparent z-30 pointer-events-none"></div>
          
          {/* Scroll container */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll items-center">
              {allCompanies.map((company, idx) => (
                <div
                  key={`${company}-${idx}`}
                  className="flex-shrink-0 mx-2 sm:mx-3 md:mx-4 lg:mx-6"
                >
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold whitespace-nowrap text-text-secondary dark:text-slate-400 opacity-40 hover:opacity-70 transition-opacity duration-300 cursor-default select-none">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
          will-change: transform;
          display: flex;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default CompanyLogos;
