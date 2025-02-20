import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';

const faqs = {
  en: [
    {
      question: 'What is the vehicle tax exemption service?',
      answer: 'Our service helps you determine if you are eligible for vehicle tax exemption in Portugal and assists with the application process. We handle all the paperwork and communication with authorities for a flat fee of €99.',
    },
    {
      question: 'Who is eligible for vehicle tax exemption?',
      answer: 'Eligibility depends on various factors including residency status, vehicle age and type, and current tax situation. Our assessment tool will help determine your specific eligibility.',
    },
    {
      question: 'How long does the process take?',
      answer: 'The typical processing time is 2-4 weeks, though this can vary depending on your specific case and the authorities\' current workload.',
    },
    {
      question: 'What documents will I need?',
      answer: 'Common required documents include proof of residency, vehicle registration papers, and identification. Our system will guide you through exactly what you need based on your situation.',
    },
  ],
  de: [
    {
      question: 'Was ist der Kfz-Steuerbefreiungsservice?',
      answer: 'Unser Service hilft Ihnen festzustellen, ob Sie für eine Kfz-Steuerbefreiung in Portugal in Frage kommen und unterstützt Sie beim Antragsverfahren. Wir übernehmen den gesamten Papierkram und die Kommunikation mit den Behörden für eine Pauschale von 99 €.',
    },
    {
      question: 'Wer kann eine Kfz-Steuerbefreiung beantragen?',
      answer: 'Die Berechtigung hängt von verschiedenen Faktoren ab, einschließlich Aufenthaltsstatus, Fahrzeugalter und -typ sowie der aktuellen Steuersituation. Unser Bewertungstool hilft Ihnen, Ihre spezifische Berechtigung zu ermitteln.',
    },
    {
      question: 'Wie lange dauert der Prozess?',
      answer: 'Die typische Bearbeitungszeit beträgt 2-4 Wochen, kann aber je nach Ihrem spezifischen Fall und der aktuellen Arbeitsbelastung der Behörden variieren.',
    },
    {
      question: 'Welche Dokumente benötige ich?',
      answer: 'Zu den üblichen erforderlichen Dokumenten gehören Aufenthaltsnachweis, Fahrzeugpapiere und Identitätsnachweis. Unser System führt Sie genau durch die Dokumente, die Sie basierend auf Ihrer Situation benötigen.',
    },
  ]
};

export function FAQ() {
  const { currentLanguage } = useLanguage();
  const currentFaqs = faqs[currentLanguage as keyof typeof faqs] || faqs.en;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        {currentLanguage === 'de' ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
      </h2>
      <div className="space-y-4">
        {currentFaqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <summary className="flex justify-between items-center cursor-pointer p-6">
              <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
              <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );
}