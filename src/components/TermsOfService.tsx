import React from 'react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  const { i18n } = useTranslation();
  const isGerman = i18n.language === 'de';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-8"
      >
        {isGerman ? 'Zurück' : 'Back'}
      </Button>

      <div className="prose prose-lg max-w-none">
        <h1>{isGerman ? 'Nutzungsbedingungen' : 'Terms of Service'}</h1>

        {isGerman ? (
          <>
            <h2>1. Allgemeine Bestimmungen</h2>
            <p>
              Diese Nutzungsbedingungen regeln die Nutzung unserer Dienstleistungen zur Steuerbefreiung von Fahrzeugen.
            </p>

            <h2>2. Leistungsbeschreibung</h2>
            <p>
              Wir bieten eine Plattform zur Prüfung der Berechtigung für Steuerbefreiungen bei Fahrzeugimporten.
            </p>

            <h2>3. Datenschutz</h2>
            <p>
              Der Schutz Ihrer persönlichen Daten hat für uns höchste Priorität. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
            </p>

            <h2>4. Haftung</h2>
            <p>
              Wir übernehmen keine Garantie für die Vollständigkeit und Richtigkeit der bereitgestellten Informationen.
            </p>
          </>
        ) : (
          <>
            <h2>1. General Provisions</h2>
            <p>
              These terms of service govern the use of our vehicle tax exemption services.
            </p>

            <h2>2. Service Description</h2>
            <p>
              We provide a platform for checking eligibility for tax exemptions on vehicle imports.
            </p>

            <h2>3. Privacy</h2>
            <p>
              The protection of your personal data is our highest priority. For more information, please see our privacy policy.
            </p>

            <h2>4. Liability</h2>
            <p>
              We do not guarantee the completeness and accuracy of the information provided.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Ensure proper default export
export default TermsOfService;