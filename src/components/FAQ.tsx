import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const faqs = {
  en: [
    {
      question: 'What is the vehicle tax exemption service?',
      answer: 'Our service helps you determine if you are eligible for vehicle tax exemption in Portugal and assists with the application process. We handle all the paperwork and communication with authorities for a flat fee of €99.',
    },
    {
      question: 'Who is eligible for vehicle tax exemption?',
      answer: 'Eligibility depends on various factors including residency status, vehicle ownership duration, EU registration, and tax payment history. Our assessment tool will help determine your specific eligibility based on Portuguese regulations.',
    },
    {
      question: 'How long does the process take?',
      answer: 'The typical processing time is 2-4 weeks, though this can vary depending on your specific case and the authorities\' current workload. We keep you updated throughout the entire process.',
    },
    {
      question: 'What documents will I need?',
      answer: 'Required documents typically include: proof of residency, vehicle registration papers, proof of ownership for at least 6 months, proof of tax payment in the EU, and valid identification. Our system will provide a detailed checklist based on your situation.',
    },
  ],
  de: [
    {
      question: 'Was ist der Kfz-Steuerbefreiungsservice?',
      answer: 'Unser Service hilft Ihnen festzustellen, ob Sie für eine Kfz-Steuerbefreiung in Portugal in Frage kommen und unterstützt Sie beim Antragsverfahren. Wir übernehmen den gesamten Papierkram und die Kommunikation mit den Behörden für eine Pauschale von 99 €.',
    },
    {
      question: 'Wer kann eine Kfz-Steuerbefreiung beantragen?',
      answer: 'Die Berechtigung hängt von verschiedenen Faktoren ab, einschließlich Aufenthaltsstatus, Fahrzeugbesitzdauer, EU-Zulassung und Steuerzahlungshistorie. Unser Bewertungstool hilft Ihnen, Ihre spezifische Berechtigung gemäß portugiesischer Vorschriften zu ermitteln.',
    },
    {
      question: 'Wie lange dauert der Prozess?',
      answer: 'Die typische Bearbeitungszeit beträgt 2-4 Wochen, kann aber je nach Ihrem spezifischen Fall und der aktuellen Arbeitsbelastung der Behörden variieren. Wir halten Sie während des gesamten Prozesses auf dem Laufenden.',
    },
    {
      question: 'Welche Dokumente benötige ich?',
      answer: 'Zu den erforderlichen Dokumenten gehören in der Regel: Aufenthaltsnachweis, Fahrzeugpapiere, Eigentumsnachweis für mindestens 6 Monate, Nachweis der Steuerzahlung in der EU und gültiger Ausweis. Unser System stellt Ihnen eine detaillierte Checkliste basierend auf Ihrer Situation zur Verfügung.',
    },
  ]
};

export function FAQ() {
  const { i18n } = useTranslation();
  const currentFaqs = faqs[i18n.language as keyof typeof faqs] || faqs.en;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          {i18n.language === 'de' ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          {currentFaqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <summary 
                className="flex justify-between items-center cursor-pointer p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                role="button"
                aria-expanded="false"
              >
                <h3 className="text-lg font-medium text-gray-900 pr-8">{faq.question}</h3>
                <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6 text-gray-600 prose prose-sm max-w-none">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;