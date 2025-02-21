import React from 'react';
import { ArrowLeft, Shield, Lock, FileText } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Shield className="w-12 h-12" />
              <Lock className="w-12 h-12" />
              <FileText className="w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Privacy Policy</h1>
            <p className="text-blue-100 text-center mt-4">Last updated: {lastUpdated}</p>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                Welcome to UNITAIN ("we," "us," or "our"). We are committed to protecting and respecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal data when you visit our website https://unitain.net (the "Website") or use our services related to vehicle import and legalization in Portugal.
              </p>
              <p className="text-gray-600 mt-4">
                By accessing or using our Website or services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with its terms, please refrain from using our Website or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Controller and Contact Information</h2>
              <p className="text-gray-600">
                For the purposes of the General Data Protection Regulation (GDPR), the "controller" of your personal data is:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Email: support@unitain.net</p>
              </div>
              <p className="text-gray-600 mt-4">
                If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at the email address above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Personal Data We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Contact Information</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Name, email address, phone number</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Identification Data</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Driver's license details</li>
                    <li>National ID/passport number</li>
                    <li>Proof of address abroad or in Portugal</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Vehicle Information</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Make, model, year</li>
                    <li>Ownership details required for import eligibility</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.4 Technical Usage Data</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>IP address, browser type, operating system</li>
                    <li>Referring URLs, pages visited</li>
                    <li>Interaction with Website features</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.5 Payment Information</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Limited payment details (card type, partial numbers)</li>
                    <li>Full payment details handled by payment provider</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Personal Data</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Service Provision</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Verifying tax exemption eligibility</li>
                    <li>Processing import documentation</li>
                    <li>Guiding you through the legalization process</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Customer Support</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Responding to inquiries and service requests</li>
                    <li>Providing updates on your application</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Legal Obligations</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Complying with applicable laws and regulations</li>
                    <li>Sharing necessary data with authorities</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Legal Basis for Processing</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><span className="font-semibold">Contractual Necessity:</span> Processing required to provide our services</li>
                <li><span className="font-semibold">Legal Obligation:</span> Compliance with tax and customs requirements</li>
                <li><span className="font-semibold">Legitimate Interests:</span> Website analytics and security measures</li>
                <li><span className="font-semibold">Consent:</span> Marketing communications (where applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-600">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Once data is no longer needed, it is securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="list-disc pl-6 text-gray-600 space-y-3">
                  <li><span className="font-semibold">Access:</span> Request a copy of your personal data</li>
                  <li><span className="font-semibold">Rectification:</span> Correct inaccurate data</li>
                  <li><span className="font-semibold">Erasure:</span> Request deletion of your data</li>
                  <li><span className="font-semibold">Restriction:</span> Limit how we use your data</li>
                  <li><span className="font-semibold">Portability:</span> Receive your data in a structured format</li>
                  <li><span className="font-semibold">Object:</span> Oppose processing based on legitimate interests</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                For any questions about this Privacy Policy or to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-800">UNITAIN</p>
                <p className="text-gray-600">Email: info@unitain.net</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}