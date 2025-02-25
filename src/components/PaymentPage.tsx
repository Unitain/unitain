import React from 'react';
import { PayPalButton } from './PayPalButton';
import { Button } from './Button';
import { useAuthStore } from '../lib/store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentPageProps {
  onBack: () => void;
}

export function PaymentPage({ onBack }: PaymentPageProps) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth/signin');
    }
  }, [user, navigate]);

  const handlePaymentSuccess = async (data: any) => {
    try {
      console.log('Payment successful:', data);
      
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // Store success state
      localStorage.setItem('payment_success', 'true');
      
      // Show success message
      toast.success(t('payment.success'));

      // Redirect to dashboard
      navigate(`/dashboard/${user.id}/submission`);
    } catch (error) {
      console.error('Payment success handler error:', error);
      toast.error(t('payment.error'));
      navigate('/auth/signin');
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('payment.signInRequired')}</h1>
        <p className="mb-4">{t('payment.signInMessage')}</p>
        <Button onClick={() => navigate('/auth/signin')}>
          {t('payment.signIn')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{t('payment.title')}</h1>
      <p className="text-gray-600 mb-8">{t('payment.subtitle')}</p>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {t('payment.amount')}
          </div>
          <div className="text-gray-500">{t('payment.oneTime')}</div>
          <div className="text-sm text-gray-400 mt-1">
            {t('payment.noHiddenFees')}
          </div>
        </div>

        <div className="space-y-6">
          <PayPalButton
            amount={99}
            onSuccess={handlePaymentSuccess}
            onError={(error) => {
              console.error('Payment error:', error);
              toast.error(t('payment.error'));
            }}
            onCancel={() => {
              console.log('Payment cancelled');
              toast.error(t('payment.cancelled'));
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          {Object.entries(t('payment.features', { returnObjects: true })).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">{value}</span>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          {t('payment.legal')}{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            {t('payment.termsLink')}
          </a>{' '}
          {t('payment.andText')}{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            {t('payment.privacyLink')}
          </a>
        </div>
      </div>

      <div className="text-center">
        <Button variant="secondary" onClick={onBack}>
          {t('payment.back')}
        </Button>
      </div>
    </div>
  );
}

export default PaymentPage;