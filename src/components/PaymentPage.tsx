import React, { useState } from 'react';
import { ArrowLeft, Shield, Globe2, BadgeCheck, CreditCard, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../lib/store';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import axios from "axios"

interface PaymentPageProps {
  onBack: () => void;
}

export function PaymentPage({ onBack }: PaymentPageProps) {
  const { user, isLoading, isInitialized } = useAuthStore();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amount = 99;
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: { preventDefault: () => void; }) =>{
    setLoading(true)
    e.preventDefault()

    // axios.post('http://localhost:8000/api/payment')
    axios.post('https://unitain-server.vercel.app/api/payment')
    .then(res => {
      window.location.href = res.data;
      setLoading(false)
    })
    .catch(error => {
      setLoading(false)
      console.log("error", error);
    })
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('payment.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <Button
            variant="secondary"
            className="mb-8"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('payment.back')}
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('payment.signInRequired')}</h2>
            <p className="text-gray-600 mb-6">{t('payment.signInMessage')}</p>
            <Button onClick={() => document.getElementById('auth-button')?.click()}>
              {t('payment.signIn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Button
          variant="secondary"
          className="mb-8"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('payment.back')}
        </Button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {t('payment.title')}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-4">
                {t('payment.subtitle')}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-50 rounded-full px-6 py-2 text-blue-700 font-medium mb-4">
                {t('payment.oneTime')}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{t('payment.amount')}</div>
              <p className="text-gray-600">{t('payment.noHiddenFees')}</p>
            </div>

            <div className="flex justify-center mb-8">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Payment (Test)'
                )}
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-600">
                <div className="flex flex-col items-center">
                  <Shield className="w-5 h-5 text-blue-600 mb-2" />
                  <span>{t('payment.features.secure')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Globe2 className="w-5 h-5 text-blue-600 mb-2" />
                  <span>{t('payment.features.support')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mb-2" />
                  <span>{t('payment.features.encrypted')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <BadgeCheck className="w-5 h-5 text-blue-600 mb-2" />
                  <span>{t('payment.features.verified')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                {t('payment.legal')}{' '}
                <button
                  onClick={() => window.open('/terms', '_blank')}
                  className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {t('payment.termsLink')}
                </button>
                {' '}{t('payment.andText')}{' '}
                <button
                  onClick={() => window.open('/privacy', '_blank')}
                  className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {t('payment.privacyLink')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}