import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { submitContactForm } from '../lib/contact';
import { useAuthStore } from '../lib/store';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // If user is logged in, use their email
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

      console.log('Submitting contact form with data:', {
        ...submissionData,
        metadata: {
          ...submissionData.metadata,
          userId: user?.id ? '[REDACTED]' : undefined
        }
      });

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
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Your name"
          disabled={isSubmitting}
          minLength={2}
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={user?.email || formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="your.email@example.com"
          disabled={isSubmitting || !!user?.email}
        />
        {user?.email && (
          <p className="mt-1 text-sm text-gray-500">
            Using your account email
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="How can we help you?"
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
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}