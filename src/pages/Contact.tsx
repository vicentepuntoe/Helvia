import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';
import Navbar from '../components/Navbar';

// EmailJS Configuration
// Las credenciales se obtienen de variables de entorno para mayor seguridad
// Si no están configuradas, el formulario funcionará en modo simulación
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Verificar si las credenciales están configuradas
      const isEmailJSConfigured = EMAILJS_SERVICE_ID && 
                                   EMAILJS_TEMPLATE_ID && 
                                   EMAILJS_PUBLIC_KEY &&
                                   EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                                   EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
                                   EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

      if (isEmailJSConfigured) {
        // Inicializar EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);

        // Preparar los parámetros del email
        const templateParams = {
          to_name: formData.name,
          to_email: formData.email,
          from_name: 'Helvia',
          from_email: 'contacto@helvia.com', // Correo genérico - puedes cambiarlo
          user_name: formData.name,
          user_email: formData.email,
          user_company: formData.company || (language === 'es' ? 'No especificada' : language === 'en' ? 'Not specified' : language === 'pt' ? 'Não especificada' : 'Non spécifiée'),
          user_message: formData.message,
          reply_to: formData.email,
          // Mensaje de confirmación personalizado según el idioma
          confirmation_message: t.contact.confirmationEmail,
        };

        console.log('Enviando email con EmailJS...');
        console.log('Service ID:', EMAILJS_SERVICE_ID);
        console.log('Template ID:', EMAILJS_TEMPLATE_ID);
        console.log('To Email:', formData.email);

        // Enviar email al usuario
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        console.log('Email enviado exitosamente:', response);
      } else {
        // Modo simulación: simular el envío del email para proyectos de portfolio
        console.warn('⚠️ EmailJS no está configurado - modo simulación');
        console.log('Para activar el envío real de emails:');
        console.log('1. Crea una cuenta en https://www.emailjs.com');
        console.log('2. Configura un servicio de email y una plantilla');
        console.log('3. Crea un archivo .env en la raíz del proyecto con:');
        console.log('   VITE_EMAILJS_SERVICE_ID=tu_service_id');
        console.log('   VITE_EMAILJS_TEMPLATE_ID=tu_template_id');
        console.log('   VITE_EMAILJS_PUBLIC_KEY=tu_public_key');
        console.log('4. Reinicia el servidor de desarrollo');
        console.log('Datos del formulario que se enviarían:', formData);
        
        // Simular delay de envío
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // En producción real, aquí podrías enviar los datos a un webhook o API
      }

      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', message: '' });
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : t.contact.errorMessage
      );
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
              {t.contact.title}
            </h1>
            <p className="text-lg text-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-card dark:bg-slate-800 rounded-xl shadow-xl border-2 border-border dark:border-slate-700 p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-text-primary dark:text-white mb-2">
                  {t.contact.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder={t.contact.namePlaceholder}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-primary dark:text-white mb-2">
                  {t.contact.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder={t.contact.emailPlaceholder}
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-text-primary dark:text-white mb-2">
                  {t.contact.companyLabel}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder={t.contact.companyPlaceholder}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-text-primary dark:text-white mb-2">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold text-base hover:bg-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isSubmitting ? t.contact.submitting : t.contact.submitButton}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-primary-soft dark:bg-primary/20 border-2 border-primary rounded-lg p-4 flex items-center gap-3 animate-fade-in-up">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-text-primary dark:text-white">{t.contact.successMessage}</p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-500 rounded-lg p-4 flex items-center gap-3 animate-fade-in-up">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage || t.contact.errorMessage}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;

