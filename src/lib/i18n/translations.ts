import { Language, Translation, languages, defaultLanguage } from './translations';

export type Language = 'en' | 'de' | 'nl';

export interface Translation {
  [key: string]: string;
}

export interface LanguageConfig {
  id: number;
  language: Language;
  name: string;
  nativeName: string;
  translations: Translation;
}

export const defaultLanguage: Language = 'en';

export const languages: LanguageConfig[] = [
  {
    id: 1,
    language: 'en',
    name: 'English',
    nativeName: 'English',
    translations: {
      // Navigation
      'nav.signin': 'Sign In',
      'nav.signout': 'Sign Out',
      'nav.signingout': 'Signing Out...',

      // Common
      'common.back': 'Back',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.retry': 'Try Again',
      'common.success': 'Success',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.submit': 'Submit',
      'common.cancel': 'Cancel',

      // Contact Form
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Get in touch with our experts for personalized assistance',
      'contact.form.name': 'Name',
      'contact.form.namePlaceholder': 'Enter your name',
      'contact.form.email': 'Email',
      'contact.form.emailPlaceholder': 'Enter your email address',
      'contact.form.message': 'Message',
      'contact.form.messagePlaceholder': 'How can we help you?',
      'contact.form.send': 'Send Message',
      'contact.form.sending': 'Sending...',
      'contact.form.usingAccountEmail': 'Using your account email',
      'contact.features.consultation.title': 'Free Consultation',
      'contact.features.consultation.description': 'Get expert advice on your specific situation',
      'contact.features.response.title': 'Quick Response',
      'contact.features.response.description': 'We typically respond within 24 hours',
      'contact.features.security.title': 'Secure Communication',
      'contact.features.security.description': 'Your information is protected',
      'contact.footer.terms': 'By submitting this form, you agree to our terms of service and privacy policy.',
      'contact.footer.response': 'We aim to respond within 24 hours during business days.',

      // Eligibility Checker
      'eligibility.title': 'Check Your Eligibility',
      'eligibility.progress': '{{current}} of {{total}}',
      'eligibility.categories.residency_status': 'Residency Status',
      'eligibility.categories.vehicle_ownership': 'Vehicle Ownership',
      'eligibility.categories.vehicle_registration': 'Vehicle Registration',
      'eligibility.categories.tax_status': 'Tax Status',
      'eligibility.categories.additional_information': 'Additional Information',
      
      'eligibility.questions.permanentMove': 'Are you permanently moving to Portugal?',
      'eligibility.questions.deregistered': 'Have you deregistered from your previous residence?',
      'eligibility.questions.previousResidence': 'Have you lived outside Portugal for at least 12 months?',
      'eligibility.questions.ownershipDuration': 'Have you owned the vehicle for at least 6 months?',
      'eligibility.questions.personalGoods': 'Is the vehicle part of your personal goods?',
      'eligibility.questions.registeredName': 'Is the vehicle registered in your name?',
      'eligibility.questions.euRegistration': 'Is the vehicle registered in an EU country?',
      'eligibility.questions.documentation': 'Do you have all required vehicle documents?',
      'eligibility.questions.vatPaid': 'Has VAT been paid on the vehicle in the EU?',
      'eligibility.questions.proofDocuments': 'Can you provide proof of vehicle ownership and residence?',
      'eligibility.questions.importType': 'Are you importing as an individual or company?',
      'eligibility.questions.additionalVehicles': 'Are you importing additional vehicles?',

      'eligibility.options.yes': 'Yes',
      'eligibility.options.no': 'No',
      'eligibility.options.individual': 'Individual',
      'eligibility.options.company': 'Company',

      'eligibility.buttons.previous': 'Previous Question',
      'eligibility.buttons.reviewAnswers': 'Review Answers',
      'eligibility.buttons.buyNow': 'Continue to Payment',
      'eligibility.buttons.contactUs': 'Contact Support',

      'eligibility.results.title': 'Your Eligibility Results',
      'eligibility.results.eligible': 'Good news! You appear to be eligible for tax exemption.',
      'eligibility.results.notEligible': 'Based on your answers, you may not be eligible for tax exemption.',
      'eligibility.results.needsMoreInfo': 'We need more information to determine your eligibility.',
      'eligibility.results.nextSteps': 'Next steps',
      'eligibility.results.steps.documents': 'Prepare your documentation',
      'eligibility.results.steps.consultation': 'Schedule a consultation',
      'eligibility.results.steps.application': 'Begin your application',
      'eligibility.results.consultRecommended': 'We recommend scheduling a consultation to discuss your options.',

      'eligibility.errors.answerFailed': 'Failed to save your answer. Please try again.',
      'eligibility.errors.noAnswers': 'Please complete all questions before submitting.',
      'eligibility.errors.saveFailed': 'Failed to save your eligibility check. Please try again.',
      'eligibility.errors.loadingFailed': 'Failed to load eligibility checker.',

      // Hero Section
      'hero.title': 'Avoid High Import Taxes – See If You Qualify in Minutes!',
      'hero.subtitle': 'Most expats pay thousands in unnecessary car import taxes. Find out if you can skip them with our quick and hassle-free tax check.',
      'hero.cta': 'Start Your Tax Check Now',

      // Benefits Section
      'benefits.tax.title': 'Save Thousands on Import Taxes',
      'benefits.tax.description': 'Find out in minutes if you don\'t have to pay Portugal\'s expensive car import tax.',
      'benefits.paperwork.title': 'No Paperwork, No Headaches',
      'benefits.paperwork.description': 'We take care of all the forms and legal steps, so you don\'t have to deal with Portuguese bureaucracy.',
      'benefits.process.title': 'Fast & Simple Process',
      'benefits.process.description': 'Answer a few questions now—if you qualify, we handle everything to get your car legally imported.',

      // Process Section
      'process.title': 'How It Works',
      'process.step1.title': 'Check Eligibility',
      'process.step1.description': 'Answer a few simple questions about your situation',
      'process.step2.title': 'Submit Documents',
      'process.step2.description': 'Upload required documentation through our secure platform',
      'process.step3.title': 'We Process',
      'process.step3.description': 'Our experts handle all communication with authorities',
      'process.step4.title': 'Get Approved',
      'process.step4.description': 'Receive your tax exemption confirmation',

      // Testimonials Section
      'testimonials.title': 'What Our Clients Say',

      // CTA Section
      'cta.title': 'Ready to Check Your Tax Exemption Eligibility?',
      'cta.subtitle': 'Start your application today and let our experts handle the rest.',
      'cta.contact': 'Contact Us',
      'cta.privacy': 'Privacy Policy',

      // Payment Page
      'payment.title': 'Complete Your Payment',
      'payment.subtitle': 'Secure payment processing with PayPal',
      'payment.oneTime': 'One-Time Payment',
      'payment.amount': '€99',
      'payment.noHiddenFees': 'No hidden fees or recurring charges',
      'payment.loading': 'Loading payment system...',
      'payment.back': 'Back',
      'payment.signInRequired': 'Sign In Required',
      'payment.signInMessage': 'Please sign in to continue with your payment.',
      'payment.signIn': 'Sign In',
      'payment.features.secure': 'Secure Payment',
      'payment.features.support': '24/7 Support',
      'payment.features.encrypted': 'SSL Encrypted',
      'payment.features.verified': 'Verified Service',
      'payment.legal': 'By proceeding with the payment, you agree to our',
      'payment.termsLink': 'Terms of Service',
      'payment.andText': 'and',
      'payment.privacyLink': 'Privacy Policy',
      'payment.success': 'Payment successful! You can now proceed with your application.',
      'payment.error': 'Payment failed. Please try again or contact support.',
      'payment.cancelled': 'Payment was cancelled. Please try again when you\'re ready.',
      'payment.systemError': 'The payment system encountered an error. Please try again later.',

      // Cookie Consent
      'cookies.title': 'Cookie Settings',
      'cookies.description': 'We use cookies to enhance your browsing experience and analyze our traffic. Please choose your preferences below.',
      'cookies.accept': 'Accept All',
      'cookies.decline': 'Decline Optional',
      'cookies.privacyLink': 'Privacy Policy'
    }
  },
  {
    id: 2,
    language: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    translations: {
      // Navigation
      'nav.signin': 'Anmelden',
      'nav.signout': 'Abmelden',
      'nav.signingout': 'Wird abgemeldet...',

      // Common
      'common.back': 'Zurück',
      'common.loading': 'Lädt...',
      'common.error': 'Fehler',
      'common.retry': 'Erneut versuchen',
      'common.success': 'Erfolgreich',
      'common.next': 'Weiter',
      'common.previous': 'Zurück',
      'common.submit': 'Absenden',
      'common.cancel': 'Abbrechen',

      // Contact Form
      'contact.title': 'Kontakt',
      'contact.subtitle': 'Kontaktieren Sie unsere Experten für persönliche Unterstützung',
      'contact.form.name': 'Name',
      'contact.form.namePlaceholder': 'Geben Sie Ihren Namen ein',
      'contact.form.email': 'E-Mail',
      'contact.form.emailPlaceholder': 'Geben Sie Ihre E-Mail-Adresse ein',
      'contact.form.message': 'Nachricht',
      'contact.form.messagePlaceholder': 'Wie können wir Ihnen helfen?',
      'contact.form.send': 'Nachricht senden',
      'contact.form.sending': 'Wird gesendet...',
      'contact.form.usingAccountEmail': 'Verwendet Ihre Konto-E-Mail',
      'contact.features.consultation.title': 'Kostenlose Beratung',
      'contact.features.consultation.description': 'Erhalten Sie Expertenrat zu Ihrer spezifischen Situation',
      'contact.features.response.title': 'Schnelle Antwort',
      'contact.features.response.description': 'Wir antworten in der Regel innerhalb von 24 Stunden',
      'contact.features.security.title': 'Sichere Kommunikation',
      'contact.features.security.description': 'Ihre Daten sind geschützt',
      'contact.footer.terms': 'Mit dem Absenden dieses Formulars stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.',
      'contact.footer.response': 'Wir antworten an Werktagen innerhalb von 24 Stunden.',

      // Eligibility Checker
      'eligibility.title': 'Prüfen Sie Ihre Berechtigung',
      'eligibility.progress': '{{current}} von {{total}}',
      'eligibility.categories.residency_status': 'Aufenthaltsstatus',
      'eligibility.categories.vehicle_ownership': 'Fahrzeugeigentum',
      'eligibility.categories.vehicle_registration': 'Fahrzeugzulassung',
      'eligibility.categories.tax_status': 'Steuerstatus',
      'eligibility.categories.additional_information': 'Zusätzliche Informationen',

      'eligibility.questions.permanentMove': 'Ziehen Sie dauerhaft nach Portugal?',
      'eligibility.questions.deregistered': 'Haben Sie sich von Ihrem vorherigen Wohnsitz abgemeldet?',
      'eligibility.questions.previousResidence': 'Haben Sie mindestens 12 Monate außerhalb Portugals gelebt?',
      'eligibility.questions.ownershipDuration': 'Besitzen Sie das Fahrzeug seit mindestens 6 Monaten?',
      'eligibility.questions.personalGoods': 'Ist das Fahrzeug Teil Ihres persönlichen Eigentums?',
      'eligibility.questions.registeredName': 'Ist das Fahrzeug auf Ihren Namen zugelassen?',
      'eligibility.questions.euRegistration': 'Ist das Fahrzeug in einem EU-Land zugelassen?',
      'eligibility.questions.documentation': 'Haben Sie alle erforderlichen Fahrzeugdokumente?',
      'eligibility.questions.vatPaid': 'Wurde die Mehrwertsteuer für das Fahrzeug in der EU bezahlt?',
      'eligibility.questions.proofDocuments': 'Können Sie Nachweise für Fahrzeugeigentum und Wohnsitz vorlegen?',
      'eligibility.questions.importType': 'Importieren Sie als Privatperson oder Unternehmen?',
      'eligibility.questions.additionalVehicles': 'Importieren Sie weitere Fahrzeuge?',

      'eligibility.options.yes': 'Ja',
      'eligibility.options.no': 'Nein',
      'eligibility.options.individual': 'Privatperson',
      'eligibility.options.company': 'Unternehmen',

      'eligibility.buttons.previous': 'Vorherige Frage',
      'eligibility.buttons.reviewAnswers': 'Antworten überprüfen',
      'eligibility.buttons.buyNow': 'Weiter zur Zahlung',
      'eligibility.buttons.contactUs': 'Support kontaktieren',

      'eligibility.results.title': 'Ihre Berechtigungsergebnisse',
      'eligibility.results.eligible': 'Gute Nachrichten! Sie scheinen für die Steuerbefreiung berechtigt zu sein.',
      'eligibility.results.notEligible': 'Basierend auf Ihren Antworten sind Sie möglicherweise nicht für die Steuerbefreiung berechtigt.',
      'eligibility.results.needsMoreInfo': 'Wir benötigen weitere Informationen, um Ihre Berechtigung zu bestimmen.',
      'eligibility.results.nextSteps': 'Nächste Schritte',
      'eligibility.results.steps.documents': 'Unterlagen vorbereiten',
      'eligibility.results.steps.consultation': 'Beratungstermin vereinbaren',
      'eligibility.results.steps.application': 'Antrag beginnen',
      'eligibility.results.consultRecommended': 'Wir empfehlen eine Beratung, um Ihre Optionen zu besprechen.',

      'eligibility.errors.answerFailed': 'Fehler beim Speichern Ihrer Antwort. Bitte versuchen Sie es erneut.',
      'eligibility.errors.noAnswers': 'Bitte beantworten Sie alle Fragen vor dem Absenden.',
      'eligibility.errors.saveFailed': 'Fehler beim Speichern Ihrer Berechtigungsprüfung. Bitte versuchen Sie es erneut.',
      'eligibility.errors.loadingFailed': 'Fehler beim Laden der Berechtigungsprüfung.',

      // Hero Section
      'hero.title': 'Vermeiden Sie hohe Einfuhrsteuern – Prüfen Sie Ihre Berechtigung in Minuten!',
      'hero.subtitle': 'Die meisten Expats zahlen tausende Euro an unnötigen Kfz-Einfuhrsteuern. Finden Sie heraus, ob Sie diese vermeiden können.',
      'hero.cta': 'Jetzt Berechtigung prüfen',

      // Benefits Section
      'benefits.tax.title': 'Sparen Sie Tausende an Einfuhrsteuern',
      'benefits.tax.description': 'Erfahren Sie in wenigen Minuten, ob Sie die hohe portugiesische Kfz-Einfuhrsteuer vermeiden können.',
      'benefits.paperwork.title': 'Keine Bürokratie, kein Aufwand',
      'benefits.paperwork.description': 'Wir kümmern uns um alle Formulare und rechtlichen Schritte.',
      'benefits.process.title': 'Schneller & einfacher Prozess',
      'benefits.process.description': 'Beantworten Sie einige Fragen – wir übernehmen den Rest.',

      // Process Section
      'process.title': 'So funktioniert\'s',
      'process.step1.title': 'Berechtigung prüfen',
      'process.step1.description': 'Beantworten Sie einige einfache Fragen zu Ihrer Situation',
      'process.step2.title': 'Unterlagen einreichen',
      'process.step2.description': 'Laden Sie die erforderlichen Dokumente über unsere sichere Plattform hoch',
      'process.step3.title': 'Wir bearbeiten',
      'process.step3.description': 'Unsere Experten übernehmen die Kommunikation mit den Behörden',
      'process.step4.title': 'Genehmigung erhalten',
      'process.step4.description': 'Erhalten Sie Ihre Steuerbefreiungsbestätigung',

      // Testimonials Section
      'testimonials.title': 'Was unsere Kunden sagen',

      // CTA Section
      'cta.title': 'Bereit für Ihre Steuerbefreiung?',
      'cta.subtitle': 'Starten Sie heute Ihren Antrag und überlassen Sie den Rest unseren Experten.',
      'cta.contact': 'Kontakt aufnehmen',
      'cta.privacy': 'Datenschutzerklärung',

      // Payment Page
      'payment.title': 'Zahlung abschließen',
      'payment.subtitle': 'Sichere Zahlungsabwicklung mit PayPal',
      'payment.oneTime': 'Einmalige Zahlung',
      'payment.amount': '€99',
      'payment.noHiddenFees': 'Keine versteckten Gebühren oder wiederkehrenden Kosten',
      'payment.loading': 'Zahlungssystem wird geladen...',
      'payment.back': 'Zurück',
      'payment.signInRequired': 'Anmeldung erforderlich',
      'payment.signInMessage': 'Bitte melden Sie sich an, um mit der Zahlung fortzufahren.',
      'payment.signIn': 'Anmelden',
      'payment.features.secure': 'Sichere Zahlung',
      'payment.features.support': '24/7 Support',
      'payment.features.encrypted': 'SSL-verschlüsselt',
      'payment.features.verified': 'Verifizierter Service',
      'payment.legal': 'Mit der Zahlung stimmen Sie unseren',
      'payment.termsLink': 'Nutzungsbedingungen',
      'payment.andText': 'und der',
      'payment.privacyLink': 'Datenschutzerklärung zu',
      'payment.success': 'Zahlung erfolgreich! Sie können nun mit Ihrem Antrag fortfahren.',
      'payment.error': 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
      'payment.cancelled': 'Zahlung abgebrochen. Bitte versuchen Sie es erneut, wenn Sie bereit sind.',
      'payment.systemError': 'Das Zahlungssystem hat einen Fehler festgestellt. Bitte versuchen Sie es später erneut.',

      // Cookie Consent
      'cookies.title': 'Cookie-Einstellungen',
      'cookies.description': 'Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern und unseren Verkehr zu analysieren.',
      'cookies.accept': 'Alle akzeptieren',
      'cookies.decline': 'Optionale ablehnen',
      'cookies.privacyLink': 'Datenschutzerklärung'
    }
  },
  {
    id: 3,
    language: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    translations: {
      // Navigation
      'nav.signin': 'Inloggen',
      'nav.signout': 'Uitloggen',
      'nav.signingout': 'Uitloggen...',

      // Common
      'common.back': 'Terug',
      'common.loading': 'Laden...',
      'common.error': 'Fout',
      'common.retry': 'Opnieuw proberen',
      'common.success': 'Succes',
      'common.next': 'Volgende',
      'common.previous': 'Vorige',
      'common.submit': 'Verzenden',
      'common.cancel': 'Annuleren',

      // Contact Form
      'contact.title': 'Contact',
      'contact.subtitle': 'Neem contact op met onze experts voor persoonlijke ondersteuning',
      'contact.form.name': 'Naam',
      'contact.form.namePlaceholder': 'Vul uw naam in',
      'contact.form.email': 'E-mail',
      'contact.form.emailPlaceholder': 'Vul uw e-mailadres in',
      'contact.form.message': 'Bericht',
      'contact.form.messagePlaceholder': 'Hoe kunnen we u helpen?',
      'contact.form.send': 'Bericht verzenden',
      'contact.form.sending': 'Verzenden...',
      'contact.form.usingAccountEmail': 'Gebruikt uw account e-mail',
      'contact.features.consultation.title': 'Gratis Consultatie',
      'contact.features.consultation.description': 'Krijg deskundig advies over uw specifieke situatie',
      'contact.features.response.title': 'Snelle Reactie',
      'contact.features.response.description': 'We reageren meestal binnen 24 uur',
      'contact.features.security.title': 'Veilige Communicatie',
      'contact.features.security.description': 'Uw gegevens zijn beschermd',
      'contact.footer.terms': 'Door dit formulier te verzenden, gaat u akkoord met onze servicevoorwaarden en privacybeleid.',
      'contact.footer.response': 'We streven ernaar om binnen 24 uur op werkdagen te reageren.',

      // Eligibility Checker
      'eligibility.title': 'Check Uw Geschiktheid',
      'eligibility.progress': '{{current}} van {{total}}',
      'eligibility.categories.residency_status': 'Verblijfsstatus',
      'eligibility.categories.vehicle_ownership': 'Voertuigeigendom',
      'eligibility.categories.vehicle_registration': 'Voertuigregistratie',
      'eligibility.categories.tax_status': 'Belastingstatus',
      'eligibility.categories.additional_information': 'Aanvullende Informatie',

      'eligibility.questions.permanentMove': 'Verhuist u permanent naar Portugal?',
      'eligibility.questions.deregistered': 'Heeft u zich uitgeschreven bij uw vorige woonplaats?',
      'eligibility.questions.previousResidence': 'Heeft u minimaal 12 maanden buiten Portugal gewoond?',
      'eligibility.questions.ownershipDuration': 'Bent u al minimaal 6 maanden eigenaar van het voertuig?',
      'eligibility.questions.personalGoods': 'Is het voertuig onderdeel van uw persoonlijke bezittingen?',
      'eligibility.questions.registeredName': 'Staat het voertuig op uw naam geregistreerd?',
      'eligibility.questions.euRegistration': 'Is het voertuig geregistreerd in een EU-land?',
      'eligibility.questions.documentation': 'Heeft u alle vereiste voertuigdocumenten?',
      'eligibility.questions.vatPaid': 'Is er BTW betaald over het voertuig in de EU?',
      'eligibility.questions.proofDocuments': 'Kunt u bewijs van eigendom en verblijf overleggen?',
      'eligibility.questions.importType': 'Importeert u als particulier of bedrijf?',
      'eligibility.questions.additionalVehicles': 'Importeert u nog meer voertuigen?',

      'eligibility.options.yes': 'Ja',
      'eligibility.options.no': 'Nee',
      'eligibility.options.individual': 'Particulier',
      'eligibility.options.company': 'Bedrijf',

      'eligibility.buttons.previous': 'Vorige Vraag',
      'eligibility.buttons.reviewAnswers': 'Antwoorden Bekijken',
      'eligibility.buttons.buyNow': 'Doorgaan naar Betaling',
      'eligibility.buttons.contactUs': 'Contact Support',

      'eligibility.results.title': 'Uw Geschiktheidsresultaten',
      'eligibility.results.eligible': 'Goed nieuws! U lijkt in aanmerking te komen voor belastingvrijstelling.',
      'eligibility.results.notEligible': 'Op basis van uw antwoorden komt u mogelijk niet in aanmerking voor belastingvrijstelling.',
      'eligibility.results.needsMoreInfo': 'We hebben meer informatie nodig om uw geschiktheid te bepalen.',
      'eligibility.results.nextSteps': 'Volgende stappen',
      'eligibility.results.steps.documents': 'Documentatie voorbereiden',
      'eligibility.results.steps.consultation': 'Consultatie inplannen',
      'eligibility.results.steps.application': 'Aanvraag starten',
      'eligibility.results.consultRecommended': 'We raden aan om een consultatie in te plannen om uw opties te bespreken.',

      'eligibility.errors.answerFailed': 'Fout bij het opslaan van uw antwoord. Probeer het opnieuw.',
      'eligibility.errors.noAnswers': 'Vul alle vragen in voordat u verzendt.',
      'eligibility.errors.saveFailed': 'Fout bij het opslaan van uw geschiktheidscheck. Probeer het opnieuw.',
      'eligibility.errors.loadingFailed': 'Fout bij het laden van de geschiktheidscheck.',

      // Hero Section
      'hero.title': 'Vermijd Hoge Importbelastingen – Check Uw Geschiktheid in Minuten!',
      'hero.subtitle': 'De meeste expats betalen duizenden euro\'s aan onnodige auto-importbelastingen. Ontdek of u deze kunt vermijden.',
      'hero.cta': 'Start Uw Belastingcheck Nu',

      // Benefits Section
      'benefits.tax.title': 'Bespaar Duizenden op Importbelasting',
      'benefits.tax.description': 'Ontdek binnen minuten of u de dure Portugese auto-importbelasting niet hoeft te betalen.',
      'benefits.paperwork.title': 'Geen Papierwerk, Geen Zorgen',
      'benefits.paperwork.description': 'Wij regelen alle formulieren en juridische stappen.',
      'benefits.process.title': 'Snel & Eenvoudig Proces',
      'benefits.process.description': 'Beantwoord enkele vragen – wij regelen de rest.',

      // Process Section
      'process.title': 'Hoe Het Werkt',
      'process.step1.title': 'Check Geschiktheid',
      'process.step1.description': 'Beantwoord enkele eenvoudige vragen over uw situatie',
      'process.step2.title': 'Documenten Indienen',
      'process.step2.description': 'Upload de vereiste documentatie via ons beveiligde platform',
      'process.step3.title': 'Wij Verwerken',
      'process.step3.description': 'Onze experts handelen alle communicatie met autoriteiten af',
      'process.step4.title': 'Goedkeuring Ontvangen',
      'process.step4.description': 'Ontvang uw belastingvrijstellingsbevestiging',

      // Testimonials Section
      'testimonials.title': 'Wat Onze Klanten Zeggen',

      // CTA Section
      'cta.title': 'Klaar om Uw Belastingvrijstelling te Checken?',
      'cta.subtitle': 'Start vandaag uw aanvraag en laat onze experts de rest regelen.',
      'cta.contact': 'Contact Opnemen',
      'cta.privacy': 'Privacybeleid',

      // Payment Page
      'payment.title': 'Voltooi Uw Betaling',
      'payment.subtitle': 'Veilige betalingsverwerking met PayPal',
      'payment.oneTime': 'Eenmalige Betaling',
      'payment.amount': '€99',
      'payment.noHiddenFees': 'Geen verborgen kosten of terugkerende betalingen',
      'payment.loading': 'Betalingssysteem laden...',
      'payment.back': 'Terug',
      'payment.signInRequired': 'Inloggen Vereist',
      'payment.signInMessage': 'Log in om door te gaan met uw betaling.',
      'payment.signIn': 'Inloggen',
      'payment.features.secure': 'Veilige Betaling',
      'payment.features.support': '24/7 Support',
      'payment.features.encrypted':  'SSL Versleuteld',
      'payment.features.verified': 'Geverifieerde Service',
      'payment.legal': 'Door verder te gaan met de betaling gaat u akkoord met onze',
      'payment.termsLink': 'Servicevoorwaarden',
      'payment.andText': 'en',
      'payment.privacyLink': 'Privacybeleid',
      'payment.success': 'Betaling geslaagd! U kunt nu doorgaan met uw aanvraag.',
      'payment.error': 'Betaling mislukt. Probeer het opnieuw of neem contact op met support.',
      'payment.cancelled': 'Betaling geannuleerd. Probeer het opnieuw wanneer u er klaar voor bent.',
      'payment.systemError': 'Het betalingssysteem heeft een fout aangetroffen. Probeer het later opnieuw.',

      // Cookie Consent
      'cookies.title': 'Cookie-instellingen',
      'cookies.description': 'We gebruiken cookies om uw browse-ervaring te verbeteren en ons verkeer te analyseren.',
      'cookies.accept': 'Alles Accepteren',
      'cookies.decline': 'Optionele Weigeren',
      'cookies.privacyLink': 'Privacybeleid'
    }
  }
];