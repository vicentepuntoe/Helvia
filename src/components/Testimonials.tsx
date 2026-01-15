import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

const Testimonials = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const testimonials = [
    {
      name: 'Doug McMillon',
      role: 'CEO',
      company: 'Walmart',
      content: 'Helvia has transformed how we handle customer inquiries. Response times dropped significantly, and our team can focus on complex issues while routine questions are handled automatically.',
      avatar: 'DM',
    },
    {
      name: 'Thomas Kurian',
      role: 'CEO',
      company: 'Google Cloud',
      content: 'The smart routing feature alone has saved us hours every week. Conversations reach the right person immediately, and customers get faster, more accurate responses.',
      avatar: 'TK',
    },
    {
      name: 'Bret Taylor',
      role: 'CTO',
      company: 'Salesforce',
      content: 'We\'ve seen a measurable improvement in customer satisfaction since implementing Helvia. The 24/7 availability means we never miss an opportunity to engage with customers.',
      avatar: 'BT',
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-card dark:bg-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-white mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-lg text-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAF9] dark:bg-slate-900 p-6 sm:p-8 rounded-xl border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-soft dark:bg-primary/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/20 dark:border-primary/30">
                  <span className="text-primary font-bold text-base sm:text-lg">{testimonial.avatar}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-text-primary dark:text-white text-sm sm:text-base truncate">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-slate-400">{testimonial.role}</p>
                  <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 truncate">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-text-secondary dark:text-slate-300 leading-relaxed text-sm sm:text-[15px]">"{testimonial.content}"</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-block bg-primary text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 rounded-lg font-bold text-lg sm:text-xl lg:text-2xl hover:bg-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {t.testimonials.ctaButton}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
