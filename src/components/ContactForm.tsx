import React, { useState } from 'react';

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', email: '', company: '', message: '' });
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">Message sent successfully!</h3>
        <p className="text-text-secondary">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border-2 bg-[#F8FAF9] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
            errors.name ? 'border-red-300' : 'border-border'
          }`}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border-2 bg-[#F8FAF9] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
            errors.email ? 'border-red-300' : 'border-border'
          }`}
          placeholder="john@company.com"
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
          Company Name
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border-2 bg-[#F8FAF9] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
            errors.company ? 'border-red-300' : 'border-border'
          }`}
          placeholder="Your Company"
        />
        {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border-2 bg-[#F8FAF9] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none ${
            errors.message ? 'border-red-300' : 'border-border'
          }`}
          placeholder="Tell us about your needs..."
        ></textarea>
        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </>
        ) : (
          'Send message'
        )}
      </button>
    </form>
  );
};

export default ContactForm;

