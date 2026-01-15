import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../locales/translations';
import Navbar from '../components/Navbar';

const Register = () => {
  const { language } = useLanguage();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const t = translations[language];

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const validateForm = (): boolean => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(t.auth.errors.invalidEmail);
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setErrorMessage(t.auth.errors.weakPassword);
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t.auth.errors.passwordMismatch);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate form
    if (!validateForm()) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password);

      if (error) {
        setSubmitStatus('error');
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setErrorMessage(t.auth.errors.emailExists);
        } else if (error.message.includes('Password')) {
          setErrorMessage(t.auth.errors.weakPassword);
        } else {
          setErrorMessage(error.message || t.auth.errors.generic);
        }
      } else {
        setSubmitStatus('success');
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setSubmitStatus('error');
      setErrorMessage(t.auth.errors.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary dark:text-white mb-4">
              {t.auth.register.title}
            </h1>
            <p className="text-lg text-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
              {t.auth.register.subtitle}
            </p>
          </div>

          {/* Register Form */}
          <div className="bg-card dark:bg-slate-800 rounded-xl shadow-xl border-2 border-border dark:border-slate-700 p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-primary dark:text-white mb-2">
                  {t.auth.register.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder={t.auth.register.emailPlaceholder}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-text-primary dark:text-white mb-2">
                  {t.auth.register.passwordLabel}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder={t.auth.register.passwordPlaceholder}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary dark:text-white mb-2">
                  {t.auth.register.confirmPasswordLabel}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder={t.auth.register.confirmPasswordPlaceholder}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold text-base hover:bg-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isSubmitting ? t.auth.register.submitting : t.auth.register.submitButton}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-primary-soft dark:bg-primary/20 border-2 border-primary rounded-lg p-4 flex items-center gap-3 animate-fade-in-up">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-text-primary dark:text-white">{t.auth.register.successMessage}</p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-500 rounded-lg p-4 flex items-center gap-3 animate-fade-in-up">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage || t.auth.errors.generic}</p>
                </div>
              )}

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-border dark:border-slate-700">
                <p className="text-sm text-text-secondary dark:text-slate-400">
                  {t.auth.register.hasAccount}{' '}
                  <Link to="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors duration-200">
                    {t.auth.register.loginLink}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
