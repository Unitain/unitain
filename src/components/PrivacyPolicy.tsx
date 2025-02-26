import React from 'react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
        <h1>{isGerman ? 'Datenschutzerklärung' : 'Privacy Policy'}</h1>

        {isGerman ? (
          <>
            <h2>1. Datenschutz auf einen Blick</h2>
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>

            <h3>Datenerfassung auf dieser Website</h3>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Die Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>

            <h2>2. Hosting und Content Delivery Networks (CDN)</h2>
            <h3>Hosting mit Netlify</h3>
            <p>
              Wir hosten unsere Website bei Netlify. Anbieter ist die Netlify, Inc., 2325 3rd Street, Suite 296, San Francisco, CA 94107, USA.
            </p>

            <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3>Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h2>4. Datenerfassung auf dieser Website</h2>
            <h3>Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>

            <h2>5. Analyse-Tools und Werbung</h2>
            <h3>Google Analytics</h3>
            <p>
              Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
            </p>
          </>
        ) : (
          <>
            <h2>1. Privacy at a Glance</h2>
            <h3>General Information</h3>
            <p>
              The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you.
            </p>

            <h3>Data Collection on This Website</h3>
            <p>
              Data processing on this website is carried out by the website operator. You can find their contact details in the imprint of this website.
            </p>

            <h2>2. Hosting and Content Delivery Networks (CDN)</h2>
            <h3>Hosting with Netlify</h3>
            <p>
              We host our website with Netlify. The provider is Netlify, Inc., 2325 3rd Street, Suite 296, San Francisco, CA 94107, USA.
            </p>

            <h2>3. General Information and Mandatory Disclosures</h2>
            <h3>Data Protection</h3>
            <p>
              The operators of this website take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with statutory data protection regulations and this privacy policy.
            </p>

            <h2>4. Data Collection on This Website</h2>
            <h3>Cookies</h3>
            <p>
              Our website uses cookies. These are small text files that your web browser stores on your device. Cookies help us make our offer more user-friendly, effective, and secure.
            </p>

            <h2>5. Analytics and Advertising</h2>
            <h3>Google Analytics</h3>
            <p>
              This website uses functions of the web analytics service Google Analytics. The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default PrivacyPolicy;