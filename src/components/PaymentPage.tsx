import React, { useState } from 'react';
import { PayPalButton } from './PayPalButton';
import { Button } from './Button';
import { useAuthStore } from '../lib/store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface PaymentPageProps {
  onBack: () => void;
}

export function PaymentPage({ onBack }: PaymentPageProps) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const getStatus = JSON.parse(localStorage.getItem('userData'))

  const handleSubmit = (e: { preventDefault: () => void; }) =>{

    if (!user?.id) {
      throw new Error('User ID not found');
    }

    setLoading(true)
    e.preventDefault()
    // axios.post('http://localhost:8000/api/payment', { user_id: user?.id })
    axios.post('https://unitain-server.vercel.app/api/payment', { user_id: user?.id })
    .then(res => {
      window.location.href = res.data;
      localStorage.setItem('payment_success', 'true');
      toast.success(t('payment.success'));
      setLoading(false)
    })
    .catch(error => {
      setLoading(false)
      console.error('Payment success handler error:', error);
      toast.error(t('payment.error'));
    })
  }

  React.useEffect(() => {
    if (!user) {
      navigate('/auth/signin');
    }
  }, [user, navigate]);


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
  // if (user.payment_status === 'approved') {
  //   return (
  //     <div className="max-w-2xl mx-auto p-8 text-center">
  //       <h1 className="text-2xl font-bold mb-4 text-green-600">Payment Already Completed</h1>
  //       <p className="mb-4">Your payment has been successfully processed. You can go back to the dashboard.</p>
  //       <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white">
  //         Go to Dashboard
  //       </Button>
  //     </div>
  //   );
  // }
  return (
    <div className="max-w-2xl mx-auto p-8">
      {getStatus.payment_status === 'approved' ? (
        <div className="max-w-2xl mx-auto p-8 text-center">
           <h1 className="text-2xl font-bold mb-4 text-green-600">Payment Already Completed</h1>
           <p className="mb-4">Your payment has been successfully processed. You can go back to the dashboard.</p>
           <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white">
             Go to Dashboard
           </Button>
         </div>
      ):(
      <div>
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
          </a>
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
      )}
    </div>
  );
}

export default PaymentPage;