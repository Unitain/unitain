import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="secondary"
            onClick={onBack}
            className="inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <a href="/" className="flex-shrink-0">
            <Logo />
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Terms of Service
              </h1>
              <p className="text-blue-100">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                Welcome to UNITAIN ("we," "our," or "us"). By accessing or using our vehicle tax exemption service, you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-600">
                Our service provides assistance in determining eligibility for vehicle tax exemption in Portugal and helps with the application process. We offer:
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>Eligibility assessment</li>
                <li>Document preparation guidance</li>
                <li>Application processing support</li>
                <li>Expert consultation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Obligations</h2>
              <p className="text-gray-600">
                When using our service, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not engage in any fraudulent or deceptive practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Fees and Payment</h2>
              <p className="text-gray-600">
                Our service fee is €99, payable upon completion of the eligibility check. This fee:
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>Is non-refundable once the service has begun</li>
                <li>Covers the eligibility assessment and initial consultation</li>
                <li>Does not include government fees or taxes</li>
                <li>May be subject to change with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600">
                While we strive to provide accurate information and successful outcomes, we cannot guarantee:
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>Approval of tax exemption applications</li>
                <li>Processing times by government authorities</li>
                <li>Changes in laws or regulations</li>
                <li>Accuracy of third-party information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-600">
                We are committed to protecting your privacy and personal data. Our data collection and processing practices are detailed in our Privacy Policy, which forms part of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-600">
                We reserve the right to terminate or suspend access to our service:
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>For violation of these Terms</li>
                <li>For fraudulent or suspicious activity</li>
                <li>As required by law</li>
                <li>At our discretion with reasonable notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600">
                We may modify these Terms at any time. Continued use of our service after changes constitutes acceptance of the modified Terms. We will notify users of significant changes via email or website notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms or our service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Email: support@unitain.net</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}