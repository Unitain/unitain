import React from 'react';
import { ContactForm } from './ContactForm';
import { MessageSquare, Clock, Shield, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Our Tax Experts
            </h1>
            <p className="text-lg text-gray-600">
              Get professional advice about your vehicle tax exemption case. Our experts are here to help you navigate the process.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-4">
              <MessageSquare className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Expert Consultation</h3>
              <p className="text-gray-600">Get personalized advice from our tax specialists</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Secure Process</h3>
              <p className="text-gray-600">Your information is protected and confidential</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ContactForm />
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center text-sm text-gray-600">
            <p>By contacting us, you agree to our Terms of Service and Privacy Policy.</p>
            <p className="mt-2">We typically respond within 24 business hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}