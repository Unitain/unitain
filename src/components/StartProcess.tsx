import React from 'react';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export function StartProcess() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Headline */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Expert Vehicle Tax Exemption Check
          <span className="block text-2xl text-blue-600 mt-2">
            Save on Import Fees
          </span>
        </h1>

        {/* Main Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: 'Professional Assessment',
              description: 'Expert evaluation of your case',
              icon: Clock,
            },
            {
              title: 'Instant Results',
              description: 'Get clarity within minutes',
              icon: CheckCircle2,
            },
            {
              title: 'Expert-Verified System',
              description: 'Secure, automated process',
              icon: ShieldCheck,
            },
            {
              title: 'Data Protection',
              description: 'Your information is secure',
              icon: ShieldCheck,
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex items-start p-6 bg-gray-50 rounded-lg"
            >
              <benefit.icon className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Process Overview */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Simple 3-Step Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Answer Questions',
                description: 'Simple eligibility check',
              },
              {
                step: '2',
                title: 'Get Assessment',
                description: 'Instant evaluation',
              },
              {
                step: '3',
                title: 'Start Process',
                description: 'Begin your application',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12"
            onClick={() => {
              window.location.href = '/#eligibility-checker';
            }}
          >
            Check Your Eligibility Now
          </Button>
        </div>

        {/* Trust Elements */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center text-sm text-gray-600">
          {[
            'Secure Process',
            'Expert Assessment',
            'Data Protection Compliant',
          ].map((trust, index) => (
            <div key={index} className="flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-600 mr-2" />
              <span>{trust}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}