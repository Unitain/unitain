import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { submitContactForm } from '../lib/contact';
import { useAuthStore } from '../lib/store';
import { useTranslation } from 'react-i18next';

interface ContactFormProps {
  prefilledMessage?: string;
}

export function ContactForm({ prefilledMessage = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: prefilledMessage
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        email: user?.email || formData.email,
        metadata: {
          source: 'contact_form',
          page: window.location.pathname,
          authenticated: !!user,
          userId: user?.id
        }
      };

      const success = await submitContactForm(submissionData);

      if (success) {
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t('contact.form.name')} *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder={t('contact.form.namePlaceholder')}
          disabled={isSubmitting}
          minLength={2}
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('contact.form.email')} *
        </label>
        <input
          type="email"
          id="email"
          required
          value={user?.email || formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder={t('contact.form.emailPlaceholder')}
          disabled={isSubmitting || !!user?.email}
        />
        {user?.email && (
          <p className="mt-1 text-sm text-gray-500">
            {t('contact.form.usingAccountEmail')}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          {t('contact.form.message')} *
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder={t('contact.form.messagePlaceholder')}
          disabled={isSubmitting}
          minLength={10}
          maxLength={5000}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('contact.form.sending')}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {t('contact.form.send')}
          </>
        )}
      </Button>
    </form>
  );
}