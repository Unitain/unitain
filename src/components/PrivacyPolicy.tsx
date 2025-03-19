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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {isGerman ? 'Datenschutzerklärung' : 'Privacy Policy'}
          </h1>
          <Button variant="outline" onClick={onBack} className="mb-4">
            {isGerman ? 'Zurück' : 'Back'}
          </Button>
        </div>
        <div className="p-6 prose prose-indigo max-w-none">
          {isGerman ? (
            <>
              <h2>1. Datenschutz auf einen Blick</h2>
              <h3>Allgemeine Hinweise</h3>
              <p className='mt-2 text-sm'>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>

              <h3>Datenerfassung auf dieser Website</h3>
              <p className='mt-2 text-sm'>
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Die Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
              </p>

              <h2>2. Hosting und Content Delivery Networks (CDN)</h2>
              <h3>Hosting mit Netlify</h3>
              <p className='mt-2 text-sm'>
                Wir hosten unsere Website bei Netlify. Anbieter ist die Netlify, Inc., 2325 3rd Street, Suite 296, San Francisco, CA 94107, USA.
              </p>

              <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
              <h3>Datenschutz</h3>
              <p className='mt-2 text-sm'>
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>

              <h2>4. Datenerfassung auf dieser Website</h2>
              <h3>Cookies</h3>
              <p className='mt-2 text-sm'>
                Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
              </p>

              <h2>5. Analyse-Tools und Werbung</h2>
              <h3>Google Analytics</h3>
              <p className='mt-2 text-sm'>
                Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500"><strong className='text-base'>Last Updated:</strong> [Date]</p>

              <h3 className="mt-6 text-xl font-semibold mb-5">1. Introduction</h3>
              <p className='mt-2 text-sm'>
                UNITAIN LLC (“we,” “us,” or “our”) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information about you when you use our Platform.
                By accessing or using the Platform, you agree to this Privacy Policy. If you do not agree, please do not use our services.
              </p>

              <h3 className="mt-6 font-semibold text-xl ">2. Controller and EU Representative</h3>
              <h4 className="my-2 font-semibold">Controller:</h4>
              <p className='mt-2 text-sm'>
                UNITAIN LLC<br />
                5830 E 2nd St, Ste 7000 #22789<br />
                Casper, Wyoming 82609, USA<br />
                Email: <a className="text-indigo-600 hover:underline" href="mailto:info@unitain.net">info@unitain.net</a>
              </p>
              <h4 className="my-2 font-semibold">EU Representative:</h4>
              <p className='mt-2 text-sm'>
                If required under Article 27 of the GDPR, we will appoint an EU-based representative. The representative’s contact details (if applicable) will be made available in an updated version of this Privacy Policy or upon request at <a className="text-indigo-600 hover:underline" href="mailto:info@unitain.net">info@unitain.net</a>.
              </p>

              <h3 className="mt-6 font-semibold text-xl ">3. Data We Collect</h3>
              <p className='mt-2 text-sm'>Depending on how you interact with our Platform, we may collect:</p>
              <ul className="list-disc ml-6">
                <li className='text-sm mt-2'><strong className='text-base'>Contact Information:</strong> Name, email address, phone number.</li>
                <li className='text-sm mt-2'><strong className='text-base'>Identification Data:</strong> Information you provide for vehicle import or similar processes (e.g., driver’s license details, ID/passport numbers).</li>
                <li className='text-sm mt-2'><strong className='text-base'>Document Data:</strong> Files you upload (PDFs, images, scanned documents). Our OCR and AI tools process these documents to extract text and organize information.</li>
                <li className='text-sm mt-2'><strong className='text-base'>Technical Data:</strong> IP address, browser type, device information, operating system, and usage data such as pages viewed, time spent, and interaction logs.</li>
                <li className='text-sm mt-2'><strong className='text-base'>Payment Information:</strong> Limited payment information (e.g., payment method, partial card numbers) if you purchase any Premium Services. We use third-party payment processors who handle your card details securely.</li>
                <li className='text-sm mt-2'><strong className='text-base'>Communications:</strong> Emails, chat messages, support queries, or other communications you send us.</li>
              </ul>

              <h3 className="mt-6 font-semibold text-xl ">4. How We Use Your Data (Purposes & Legal Basis)</h3>
              <ul className="list-disc ml-6">
                <li className='text-sm mt-2'>
                  <strong>Provide Services:</strong> Offer AI-driven document analysis, assist with vehicle import processes, and deliver customer support. <em>Legal Basis:</em> Contract necessity (Art. 6(1)(b) GDPR).
                </li>
                <li className='text-sm mt-2'>
                  <strong>Manage Your Account:</strong> Create and maintain your user profile, authenticate logins, and personalize user experience. <em>Legal Basis:</em> Contract necessity (Art. 6(1)(b) GDPR).
                </li>
                <li className='text-sm mt-2'>
                  <strong>Comply with Law:</strong> Fulfill legal obligations (e.g., responding to lawful requests from authorities). <em>Legal Basis:</em> Legal obligation (Art. 6(1)(c) GDPR).
                </li>
                <li className='text-sm mt-2'>
                  <strong>Improve Our Platform:</strong> Analyze usage patterns, fix bugs, and develop new features. <em>Legal Basis:</em> Legitimate interest (Art. 6(1)(f) GDPR), balanced with your rights.
                </li>
                <li className='text-sm mt-2'>
                  <strong>Marketing and Updates:</strong> Send newsletters or promotional materials only if you have given consent or if we have a legitimate interest and you have not opted out. <em>Legal Basis:</em> Consent (Art. 6(1)(a) GDPR) or legitimate interest (Art. 6(1)(f) GDPR).
                </li>
              </ul>

              <h3 className="mt-6 font-semibold text-xl ">5. Data Storage and International Transfers</h3>
              <h4 className="my-2 font-semibold">5.1. Primary Hosting in the EU</h4>
              <p className='mt-2 text-sm'>
                Your data is generally stored on servers located in the European Union, protected by robust technical and organizational measures.
              </p>
              <h4 className="my-2 font-semibold">5.2. Transfers to the USA</h4>
              <p className='mt-2 text-sm'>
                As a Wyoming-based company, certain data may be accessed from or transferred to the US for internal operations (e.g., support). If you are located in the EU/EEA, we rely on Standard Contractual Clauses (SCCs) or other approved mechanisms to ensure your data is treated in line with GDPR requirements.
              </p>

              <h3 className="mt-6 font-semibold text-xl ">6. Retention of Your Data</h3>
              <p className='mt-2 text-sm'>
                We store your personal data only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. For instance:
              </p>
              <ul className="list-disc ml-6">
                <li className='text-sm mt-2'><strong className='text-base'>Account Data:</strong> Retained until you close your account or request deletion.</li>
                <li className='text-sm mt-2'><strong className='text-base'>Transaction Records:</strong> Kept as required by financial or tax regulations.</li>
                <li className='text-sm mt-2'><strong className='text-base'>Communications:</strong> Retained as needed for support or legal purposes.</li>
              </ul>
              <p className='mt-2 text-sm'>Once no longer needed, we securely delete or anonymize your data.</p>

              <h3 className="mt-6 font-semibold text-xl ">7. Your Rights (EU Data Subjects)</h3>
              <p className='mt-2 text-sm'>If you are in the EU/EEA, you have the following rights under the GDPR:</p>
              <ul className="list-disc ml-6">
                <li className='text-sm mt-2'>Right of Access: Receive a copy of your personal data.</li>
                <li className='text-sm mt-2'>Right of Rectification: Request correction of inaccurate data.</li>
                <li className='text-sm mt-2'>Right to Erasure: Ask for data deletion under certain conditions.</li>
                <li className='text-sm mt-2'>Right to Restrict Processing: Limit how we use your data in specific cases.</li>
                <li className='text-sm mt-2'>Right to Data Portability: Obtain your data in a structured format and transfer it to another controller.</li>
                <li className='text-sm mt-2'>Right to Object: Object to data processing based on legitimate interest or for direct marketing purposes.</li>
                <li className='text-sm mt-2'>Right to Withdraw Consent: Where processing is based on consent, you can withdraw it at any time.</li>
              </ul>
              <p className='mt-2 text-sm'>
                To exercise these rights, please contact{' '}
                <a className="text-indigo-600 hover:underline" href="mailto:info@unitain.net">
                  info@unitain.net
                </a>. You also have the right to lodge a complaint with a supervisory authority in the EU Member State of your habitual residence or place of work.
              </p>

              <h3 className="mt-6 font-semibold text-xl ">8. Security Measures</h3>
              <p className='mt-2 text-sm'>
                We implement a variety of technical and organizational measures (TOMs) to protect your personal data against unauthorized access, loss, or alteration. This includes (where applicable) encryption at rest and in transit, access controls, firewalls, and regular security assessments. However, no method of transmission or storage is 100% secure.
              </p>

              <h3 className="mt-6 font-semibold text-xl ">9. Cookies and Similar Technologies</h3>
              <h4 className="my-2 font-semibold">9.1. Cookie Usage</h4>
              <p className='mt-2 text-sm'>We use cookies (small text files stored on your device) and similar technologies to:</p>
              <ul className="list-disc ml-6">
                <li className='text-sm mt-2'>Recognize you on subsequent visits.</li>
                <li className='text-sm mt-2'>Save your preferences.</li>
                <li className='text-sm mt-2'>Analyze traffic and usage (e.g., Google Analytics).</li>
                <li className='text-sm mt-2'>Provide personalized marketing (if applicable).</li>
              </ul>
              <h4 className="my-2 font-semibold">9.2. EU Cookie Consent</h4>
              <p className='mt-2 text-sm'>
                If you are in the EU, we will display a cookie banner to obtain your consent where legally required (e.g., for non-essential or marketing cookies).
              </p>
              <h4 className="my-2 font-semibold">9.3. Managing Cookies</h4>
              <p className='mt-2 text-sm'>
                You can modify your browser settings to refuse some or all cookies or to alert you when cookies are being sent. However, if you disable or refuse cookies, some parts of the Platform may become inaccessible or not function properly.
              </p>

              <h3 className="mt-6 font-semibold text-xl ">10. Beta Services</h3>
              <p className='mt-2 text-sm'>
                If you are using our Platform features labeled as “Beta,” please note that such features are still in testing, and data loss or errors may occur. By using Beta features, you acknowledge these risks and disclaim UNITAIN from liability to the extent permitted by law.
              </p>

              <h3 className="mt-6 font-semibold text-xl ">11. Changes to This Privacy Policy</h3>
              <p className='mt-2 text-sm'>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The “Last Updated” date at the top indicates when this Policy was most recently revised. We will notify you of material changes (e.g., via email or a prominent notice on the Platform).
              </p>

              <h3 className="mt-6 font-semibold text-xl ">12. Contact Us</h3>
              <p className='mt-2 text-sm'>
                If you have any questions, concerns, or requests about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className='mt-2 text-sm'>
                UNITAIN LLC<br />
                5830 E 2nd St, Ste 7000 #22789<br />
                Casper, Wyoming 82609, USA<br />
                Email: <a className="text-indigo-600 hover:underline" href="mailto:info@unitain.net">info@unitain.net</a>
              </p>

              <h3 className="mt-6 font-semibold text-xl ">3. Final Notes</h3>
              <p className='mt-2 text-sm'>
                <strong>Language and Precedence:</strong> These Terms of Use and Privacy Policy are provided in English. If any translations are provided for convenience, the English version shall prevail in case of conflicts or ambiguities.<br />
                <strong>Disclaimer:</strong> This template is intended as a general guide. Local laws may impose additional requirements, especially regarding consumer protection or e-commerce regulations in specific EU Member States. Consult legal professionals to ensure full compliance.
              </p>
              <p className="mt-4">© UNITAIN LLC. All rights reserved.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
