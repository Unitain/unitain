import {useEffect , useState} from "react";
import {CheckCheck, LogIn, X } from "lucide-react";
// import axios from "axios";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuthStore } from './lib/store';
import { supabase } from './lib/supabase';
import { error } from "console";

const Success = () => {
  const url = new URL(window.location.href);
  const paymentDetail = url.searchParams.get('session');
  interface PaymentDetails {
    state: 'approved' | 'failed';
  }
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  console.log("🚀 ~ Success ~ paymentDetails:", paymentDetails)
  const [loading, setLoading] = useState(false);
  const {user} = useAuthStore()

  useEffect(() => {
    if (paymentDetail && !paymentDetails) {
      setLoading(true);
      try {
        const parsedResponse = JSON.parse(paymentDetail);
        console.log("🚀 ~ useEffect ~ parsedResponse:", parsedResponse)
        if (parsedResponse?.state && parsedResponse?.userId === user?.id) {
          setPaymentDetails(parsedResponse);

          updatePaymentStatus(parsedResponse.id, parsedResponse.state, parsedResponse.userId)

          toast.success("Payment Successful!");
        } else {
          console.error("Invalid payment details format");
          toast.error("Invalid payment details received.");
        }
      } catch (error) {
        console.error("Error parsing payment details:", error);
        toast.error("Failed to process payment details.");
      } finally {
        setLoading(false);
      }
    }
  }, [paymentDetail, paymentDetails]);

  const updatePaymentStatus = async (paymentId: string, newStatus: string, id: string) => {
    const { error } = await supabase
    .from('users')
    .update({payment_id: paymentId , payment_status: newStatus  })
    .eq('id', id)
    if (error) {
      // toast.error("Error updating payment: " + error.message);
      return null;
    }
  }

if (loading) return (
  <div className="w-full flex justify-center items-center mt-32">
  <button type="button" className="" disabled>
    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"></svg>
    Processing…
  </button>
  </div>
);


  return (
    <div className="h-[80vh]">
      <div className="container mx-auto flex h-full items-center justify-center">
        <div className="rounded-2xl p-20 bg-white text-center">
          {(paymentDetails?.state === 'approved' ) ? (
            <>
              <div className="p-4 w-max mx-auto rounded-full bg-green-500 text-white"><CheckCheck size={50}/></div>
              <h1 className="md:text-4xl text-2xl mt-6 font-bold">Payment Succeeded!</h1>
              <p className="mt-6 md:text-lg text-gray-600">Your payment was successful. Thank you for your purchase!</p>
              <Link to={`/dashboard/${paymentDetails?.userId}/submission`}>
                <button className="p-4 border border-black mt-6 py-2 px-4 rounded-md text-lg hover:text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 active:bg-gray-900 transition duration-200">
                 Continue To Dashboard
                </button>
              </Link>
            </>
          ): (
            <div>
                  <h1 className="md:text-4xl text-2xl mt-6 font-bold">No payment details found</h1>
                  <p className="mt-6 md:text-lg text-gray-600">something went wrong</p>
                  <button className="p-4 border border-black mt-6 py-2 px-4 rounded-md text-lg hover:text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 active:bg-gray-900 transition duration-200">Go To Dashboard</button>
            </div>
          )} 
        </div>
      </div>
    </div>
  )
}

export default Success