import { Language, Translation } from './translations';

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

      // Hero Section
      'hero.title': 'Avoid High Import Taxes – See If You Qualify in Minutes!',
      'hero.subtitle': 'Most expats pay thousands in unnecessary car import taxes. Find out if you can skip them with our quick and hassle-free tax check.',
      'hero.cta': 'Start Your Tax Check Now',

      // Benefits Section
      'benefits.tax.title': '✅ Save Thousands on Import Taxes',
      'benefits.tax.description': 'Find out in minutes if you don\'t have to pay Portugal\'s expensive car import tax.',
      'benefits.paperwork.title': '📄 No Paperwork, No Headaches',
      'benefits.paperwork.description': 'We take care of all the forms and legal steps, so you don\'t have to deal with Portuguese bureaucracy.',
      'benefits.process.title': '⚡ Fast & Simple Process',
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

      // Contact Form Translations
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Get in touch with our experts for personalized assistance',
      
      // Contact Form Features
      'contact.features.consultation.title': 'Expert Consultation',
      'contact.features.consultation.description': 'Get personalized advice from our tax experts',
      'contact.features.response.title': 'Quick Response',
      'contact.features.response.description': 'Receive a response within 24 hours',
      'contact.features.security.title': 'Secure Communication',
      'contact.features.security.description': 'Your information is protected with enterprise-grade security',
      
      // Form Fields
      'contact.form.name': 'Name',
      'contact.form.namePlaceholder': 'Enter your full name',
      'contact.form.email': 'Email',
      'contact.form.emailPlaceholder': 'Enter your email address',
      'contact.form.message': 'Message',
      'contact.form.messagePlaceholder': 'How can we help you?',
      'contact.form.send': 'Send Message',
      'contact.form.sending': 'Sending...',
      'contact.form.usingAccountEmail': 'Using email from your account',
      
      // Footer
      'contact.footer.terms': 'By submitting this form, you agree to our terms of service and privacy policy.',
      'contact.footer.response': 'We typically respond within 24 hours during business days.',

      // Eligibility Checker
      'eligibility.title': 'Check Your Eligibility',
      'eligibility.progress': 'Question {{current}} of {{total}}',
      'eligibility.categories.residency_status': 'Residency Status',
      'eligibility.categories.vehicle_ownership': 'Vehicle Ownership',
      'eligibility.categories.vehicle_registration': 'Vehicle Registration',
      'eligibility.categories.tax_status': 'Tax Status',
      'eligibility.categories.additional_information': 'Additional Information',

      'eligibility.questions.permanentMove': 'Are you planning a permanent move to Portugal?',
      'eligibility.questions.deregistered': 'Have you already deregistered your main residence in your previous country?',
      'eligibility.questions.previousResidence': 'Have you lived at your previous residence for at least 6 months?',
      'eligibility.questions.ownershipDuration': 'Have you owned the vehicle for at least 6 months before your move?',
      'eligibility.questions.personalGoods': 'Is this vehicle being imported as personal moving goods?',
      'eligibility.questions.registeredName': 'Is the vehicle registered in your name?',
      'eligibility.questions.euRegistration': 'Was the vehicle registered in an EU member state?',
      'eligibility.questions.documentation': 'Do you have all required vehicle documentation?',
      'eligibility.questions.vatPaid': 'Has VAT been fully paid in the country of origin?',
      'eligibility.questions.proofDocuments': 'Do you have all necessary documentation proving your residence duration and vehicle ownership?',
      'eligibility.questions.importType': 'Are you importing as a private individual or a company?',
      'eligibility.questions.additionalVehicles': 'Do you plan to import additional vehicles?',

      'eligibility.options.yes': 'Yes',
      'eligibility.options.no': 'No',
      'eligibility.options.individual': 'Individual',
      'eligibility.options.company': 'Company',

      'eligibility.buttons.previous': 'Previous Question',
      'eligibility.buttons.reviewAnswers': 'Review Answers',
      'eligibility.buttons.buyNow': 'Buy Now',
      'eligibility.buttons.contactUs': 'Contact Us',

      'eligibility.results.title': 'Eligibility Assessment',
      'eligibility.results.needsMoreInfo': 'Please complete all questions for a full assessment.',
      'eligibility.results.eligible': 'Based on your responses, you may be eligible for tax exemption!',
      'eligibility.results.nextSteps': 'Next steps',
      'eligibility.results.steps.documents': 'Prepare all required documentation',
      'eligibility.results.steps.consultation': 'Schedule a consultation with our experts',
      'eligibility.results.steps.application': 'Begin your application process',
      'eligibility.results.notEligible': 'Based on your responses, you may not be eligible for tax exemption.',
      'eligibility.results.consultRecommended': 'We recommend consulting with our experts to explore your options.'
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

      // Hero Section
      'hero.title': 'Vermeiden Sie hohe Einfuhrsteuern – Prüfen Sie Ihre Berechtigung in wenigen Minuten!',
      'hero.subtitle': 'Die meisten Expats zahlen tausende Euro an unnötigen Kfz-Einfuhrsteuern. Finden Sie heraus, ob Sie diese mit unserer schnellen und unkomplizierten Steuerprüfung vermeiden können.',
      'hero.cta': 'Jetzt Berechtigung prüfen',

      // Benefits Section
      'benefits.tax.title': '✅ Tausende Euro Einfuhrsteuern sparen',
      'benefits.tax.description': 'Erfahren Sie in wenigen Minuten, ob Sie die hohe portugiesische Kfz-Einfuhrsteuer vermeiden können.',
      'benefits.paperwork.title': '📄 Keine Bürokratie, kein Aufwand',
      'benefits.paperwork.description': 'Wir kümmern uns um alle Formulare und rechtlichen Schritte, damit Sie sich nicht mit der portugiesischen Bürokratie auseinandersetzen müssen.',
      'benefits.process.title': '⚡ Schneller & einfacher Prozess',
      'benefits.process.description': 'Beantworten Sie jetzt einige Fragen – wenn Sie berechtigt sind, übernehmen wir die komplette legale Einfuhr Ihres Fahrzeugs.',

      // Process Section
      'process.title': 'So funktioniert\'s',
      'process.step1.title': 'Berechtigung prüfen',
      'process.step1.description': 'Beantworten Sie einige einfache Fragen zu Ihrer Situation',
      'process.step2.title': 'Unterlagen einreichen',
      'process.step2.description': 'Laden Sie die erforderlichen Dokumente über unsere sichere Plattform hoch',
      'process.step3.title': 'Wir bearbeiten',
      'process.step3.description': 'Unsere Experten übernehmen die gesamte Kommunikation mit den Behörden',
      'process.step4.title': 'Genehmigung erhalten',
      'process.step4.description': 'Erhalten Sie Ihre Steuerbefreiungsbestätigung',

      // Testimonials Section
      'testimonials.title': 'Was unsere Kunden sagen',

      // CTA Section
      'cta.title': 'Bereit, Ihre Steuerbefreiung zu prüfen?',
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

      // Contact Form Translations
      'contact.title': 'Kontakt',
      'contact.subtitle': 'Kontaktieren Sie unsere Experten für persönliche Unterstützung',
      
      // Contact Form Features
      'contact.features.consultation.title': 'Expertenberatung',
      'contact.features.consultation.description': 'Erhalten Sie persönliche Beratung von unseren Steuerexperten',
      'contact.features.response.title': 'Schnelle Antwort',
      'contact.features.response.description': 'Erhalten Sie innerhalb von 24 Stunden eine Antwort',
      'contact.features.security.title': 'Sichere Kommunikation',
      'contact.features.security.description': 'Ihre Daten sind durch Enterprise-Grade-Sicherheit geschützt',
      
      // Form Fields
      'contact.form.name': 'Name',
      'contact.form.namePlaceholder': 'Geben Sie Ihren vollständigen Namen ein',
      'contact.form.email': 'E-Mail',
      'contact.form.emailPlaceholder': 'Geben Sie Ihre E-Mail-Adresse ein',
      'contact.form.message': 'Nachricht',
      'contact.form.messagePlaceholder': 'Wie können wir Ihnen helfen?',
      'contact.form.send': 'Nachricht senden',
      'contact.form.sending': 'Wird gesendet...',
      'contact.form.usingAccountEmail': 'E-Mail aus Ihrem Konto wird verwendet',
      
      // Footer
      'contact.footer.terms': 'Mit dem Absenden dieses Formulars stimmen Sie unseren Nutzungsbedingungen und der Datenschutzerklärung zu.',
      'contact.footer.response': 'Wir antworten normalerweise innerhalb von 24 Stunden an Werktagen.',

      // Eligibility Checker
      'eligibility.title': 'Prüfen Sie Ihre Berechtigung',
      'eligibility.progress': 'Frage {{current}} von {{total}}',
      'eligibility.categories.residency_status': 'Aufenthaltsstatus',
      'eligibility.categories.vehicle_ownership': 'Fahrzeugeigentum',
      'eligibility.categories.vehicle_registration': 'Fahrzeugzulassung',
      'eligibility.categories.tax_status': 'Steuerstatus',
      'eligibility.categories.additional_information': 'Zusätzliche Informationen',

      'eligibility.questions.permanentMove': 'Planen Sie einen dauerhaften Umzug nach Portugal?',
      'eligibility.questions.deregistered': 'Haben Sie sich bereits von Ihrem Hauptwohnsitz im bisherigen Land abgemeldet?',
      'eligibility.questions.previousResidence': 'Haben Sie mindestens 6 Monate an Ihrem bisherigen Wohnsitz gelebt?',
      'eligibility.questions.ownershipDuration': 'Besitzen Sie das Fahrzeug seit mindestens 6 Monaten vor Ihrem Umzug?',
      'eligibility.questions.personalGoods': 'Wird das Fahrzeug als persönliches Umzugsgut eingeführt?',
      'eligibility.questions.registeredName': 'Ist das Fahrzeug auf Ihren Namen zugelassen?',
      'eligibility.questions.euRegistration': 'War das Fahrzeug in einem EU-Mitgliedstaat zugelassen?',
      'eligibility.questions.documentation': 'Haben Sie alle erforderlichen Fahrzeugunterlagen?',
      'eligibility.questions.vatPaid': 'Wurde die Mehrwertsteuer im Herkunftsland vollständig bezahlt?',
      'eligibility.questions.proofDocuments': 'Haben Sie alle notwendigen Unterlagen, die Ihre Aufenthaltsdauer und den Fahrzeugbesitz nachweisen?',
      'eligibility.questions.importType': 'Importieren Sie als Privatperson oder als Unternehmen?',
      'eligibility.questions.additionalVehicles': 'Planen Sie die Einfuhr weiterer Fahrzeuge?',

      'eligibility.options.yes': 'Ja',
      'eligibility.options.no': 'Nein',
      'eligibility.options.individual': 'Privatperson',
      'eligibility.options.company': 'Unternehmen',

      'eligibility.buttons.previous': 'Vorherige Frage',
      'eligibility.buttons.reviewAnswers': 'Antworten überprüfen',
      'eligibility.buttons.buyNow': 'Jetzt kaufen',
      'eligibility.buttons.contactUs': 'Kontakt aufnehmen',

      'eligibility.results.title': 'Berechtigungsprüfung',
      'eligibility.results.needsMoreInfo': 'Bitte beantworten Sie alle Fragen für eine vollständige Bewertung.',
      'eligibility.results.eligible': 'Basierend auf Ihren Antworten könnten Sie für eine Steuerbefreiung berechtigt sein!',
      'eligibility.results.nextSteps': 'Nächste Schritte',
      'eligibility.results.steps.documents': 'Bereiten Sie alle erforderlichen Unterlagen vor',
      'eligibility.results.steps.consultation': 'Vereinbaren Sie eine Beratung mit unseren Experten',
      'eligibility.results.steps.application': 'Beginnen Sie Ihren Antragsprozess',
      'eligibility.results.notEligible': 'Basierend auf Ihren Antworten sind Sie möglicherweise nicht für eine Steuerbefreiung berechtigt.',
      'eligibility.results.consultRecommended': 'Wir empfehlen Ihnen, sich von unseren Experten beraten zu lassen, um Ihre Optionen zu prüfen.'
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

      // Hero Section
      'hero.title': 'Vermijd Hoge Importbelastingen – Check Je Kwalificatie in Minuten!',
      'hero.subtitle': 'De meeste expats betalen duizenden euro\'s aan onnodige auto-importbelastingen. Ontdek of je deze kunt vermijden met onze snelle en eenvoudige belastingcheck.',
      'hero.cta': 'Start Je Belastingcheck Nu',

      // Benefits Section
      'benefits.tax.title': '✅ Bespaar Duizenden op Importbelasting',
      'benefits.tax.description': 'Ontdek binnen minuten of je de dure Portugese auto-importbelasting niet hoeft te betalen.',
      'benefits.paperwork.title': '📄 Geen Papierwerk, Geen Zorgen',
      'benefits.paperwork.description': 'Wij regelen alle formulieren en juridische stappen, zodat jij je geen zorgen hoeft te maken over Portugese bureaucratie.',
      'benefits.process.title': '⚡ Snel & Eenvoudig Proces',
      'benefits.process.description': 'Beantwoord nu enkele vragen – als je in aanmerking komt, regelen wij alles voor de legale import van je auto.',

      // Process Section
      'process.title': 'Hoe Het Werkt',
      'process.step1.title': 'Check Kwalificatie',
      'process.step1.description': 'Beantwoord enkele eenvoudige vragen over je situatie',
      'process.step2.title': 'Documenten Indienen',
      'process.step2.description': 'Upload de vereiste documentatie via ons beveiligde platform',
      'process.step3.title': 'Wij Verwerken',
      'process.step3.description': 'Onze experts handelen alle communicatie met autoriteiten af',
      'process.step4.title': 'Goedkeuring Ontvangen',
      'process.step4.description': 'Ontvang je belastingvrijstellingsbevestiging',

      // Testimonials Section
      'testimonials.title': 'Wat Onze Klanten Zeggen',

      // CTA Section
      'cta.title': 'Klaar om Je Belastingvrijstelling te Checken?',
      'cta.subtitle': 'Start vandaag je aanvraag en laat onze experts de rest regelen.',
      'cta.contact': 'Contact Opnemen',
      'cta.privacy': 'Privacybeleid',

      // Payment Page
      'payment.title': 'Voltooi Je Betaling',
      'payment.subtitle': 'Veilige betalingsverwerking met PayPal',
      'payment.oneTime': 'Eenmalige Betaling',
      'payment.amount': '€99',
      'payment.noHiddenFees': 'Geen verborgen kosten of terugkerende betalingen',
      'payment.loading': 'Betalingssysteem laden...',
      'payment.back': 'Terug',
      'payment.signInRequired': 'Inloggen Vereist',
      'payment.signInMessage': 'Log in om door te gaan met je betaling.',
      'payment.signIn': 'Inloggen',
      'payment.features.secure': 'Veilige Betaling',
      'payment.features.support': '24/7 Support',
      'payment.features.encrypted': 'SSL Versleuteld',
      'payment.features.verified': 'Geverifieerde Service',
      'payment.legal': 'Door verder te gaan met de betaling ga je akkoord met onze',
      'payment.termsLink': 'Servicevoorwaarden',
      'payment.andText': 'en',
      'payment.privacyLink': 'Privacybeleid',
      'payment.success': 'Betaling geslaagd! Je kunt nu doorgaan met je aanvraag.',
      'payment.error': 'Betaling mislukt. Probeer het opnieuw of neem contact op met support.',
      'payment.cancelled': 'Betaling geannuleerd. Probeer het opnieuw wanneer je er klaar voor bent.',
      'payment.systemError': 'Het betalingssysteem heeft een fout aangetroffen. Probeer het later opnieuw.',

      // Contact Form Translations
      'contact.title': 'Contact',
      'contact.subtitle': 'Neem contact op met onze experts voor persoonlijke assistentie',
      
      // Contact Form Features
      'contact.features.consultation.title': 'Expert Consultatie',
      'contact.features.consultation.description': 'Krijg persoonlijk advies van onze belastingexperts',
      'contact.features.response.title': 'Snelle Reactie',
      'contact.features.response.description': 'Ontvang binnen 24 uur een reactie',
      'contact.features.security.title': 'Veilige Communicatie',
      'contact.features.security.description': 'Uw gegevens worden beschermd met enterprise-grade beveiliging',
      
      // Form Fields
      'contact.form.name': 'Naam',
      'contact.form.namePlaceholder': 'Voer uw volledige naam in',
      'contact.form.email': 'E-mail',
      'contact.form.emailPlaceholder': 'Voer uw e-mailadres in',
      'contact.form.message': 'Bericht',
      'contact.form.messagePlaceholder': 'Hoe kunnen we u helpen?',
      'contact.form.send': 'Bericht versturen',
      'contact.form.sending': 'Versturen...',
      'contact.form.usingAccountEmail': 'E-mail van uw account wordt gebruikt',
      
      // Footer
      'contact.footer.terms': 'Door dit formulier te versturen gaat u akkoord met onze gebruiksvoorwaarden en privacybeleid.',
      'contact.footer.response': 'We reageren meestal binnen 24 uur op werkdagen.',

      // Eligibility Checker
      'eligibility.title': 'Check Je Kwalificatie',
      'eligibility.progress': 'Vraag {{current}} van {{total}}',
      'eligibility.categories.residency_status': 'Verblijfsstatus',
      'eligibility.categories.vehicle_ownership': 'Voertuigeigendom',
      'eligibility.categories.vehicle_registration': 'Voertuigregistratie',
      'eligibility.categories.tax_status': 'Belastingstatus',
      'eligibility.categories.additional_information': 'Aanvullende Informatie',

      'eligibility.questions.permanentMove': 'Ben je van plan permanent naar Portugal te verhuizen?',
      'eligibility.questions.deregistered': 'Heb je je al uitgeschreven van je hoofdverblijf in je vorige land?',
      'eligibility.questions.previousResidence': 'Heb je minimaal 6 maanden op je vorige adres gewoond?',
      'eligibility.questions.ownershipDuration': 'Ben je al minimaal 6 maanden eigenaar van het voertuig voor je verhuizing?',
      'eligibility.questions.personalGoods': 'Wordt dit voertuig geïmporteerd als persoonlijke verhuisgoederen?',
      'eligibility.questions.registeredName': 'Staat het voertuig op jouw naam geregistreerd?',
      'eligibility.questions.euRegistration': 'Was het voertuig geregistreerd in een EU-lidstaat?',
      'eligibility.questions.documentation': 'Heb je alle vereiste voertuigdocumentatie?',
      'eligibility.questions.vatPaid': 'Is de BTW volledig betaald in het land van herkomst?',
      'eligibility.questions.proofDocuments': 'Heb je alle nodige documenten die je verblijfsduur en voertuigeigendom bewijzen?',
      'eligibility.questions.importType': 'Importeer je als privépersoon of als bedrijf?',
      'eligibility.questions.additionalVehicles': 'Ben je van plan meer voertuigen te importeren?',

      'eligibility.options.yes': 'Ja',
      'eligibility.options.no': 'Nee',
      'eligibility.options.individual': 'Privépersoon',
      'eligibility.options.company': 'Bedrijf',

      'eligibility.buttons.previous': 'Vorige Vraag',
      'eligibility.buttons.reviewAnswers': 'Antwoorden Bekijken',
      'eligibility.buttons.buyNow': 'Nu Kopen',
      'eligibility.buttons.contactUs': 'Contact Opnemen',

      'eligibility.results.title': 'Kwalificatiebeoordeling',
      'eligibility.results.needsMoreInfo': 'Vul alle vragen in voor een volledige beoordeling.',
      'eligibility.results.eligible': 'Op basis van je antwoorden kom je mogelijk in aanmerking voor belastingvrijstelling!',
      'eligibility.results.nextSteps': 'Volgende stappen',
      'eligibility.results.steps.documents': 'Bereid alle vereiste documentatie voor',
      'eligibility.results.steps.consultation': 'Plan een consult met onze experts',
      'eligibility.results.steps.application': 'Start je aanvraagproces',
      'eligibility.results.notEligible': 'Op basis van je antwoorden kom je mogelijk niet in aanmerking voor belastingvrijstelling.', 'eligibility.results.consultRecommended': 'We raden aan om met onze experts te overleggen om je opties te bespreken.'
    }
  }
];