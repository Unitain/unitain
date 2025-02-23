import {useEffect , useState} from "react";
import {CheckCheck, LogIn, X } from "lucide-react";
// import axios from "axios";

const Success = () => {
  const url = new URL(window.location.href);
  const paymentDetail = url.searchParams.get('session');
  interface PaymentDetails {
    state: 'approved' | 'failed';
  }
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paymentDetail && !paymentDetails) {
      setLoading(true);
      try {
        const parsedResponse = JSON.parse(paymentDetail);
        setPaymentDetails(parsedResponse);
      } catch (error) {
        console.error("Error parsing payment details:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [paymentDetail, paymentDetails]);
  

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
        <div className="border rounded-lg md:p-20 md:w-2/4 shadow-lg w-full p-4 text-center">
          {(paymentDetails?.state === 'approved') ? (
            <>
              <div className="p-4 w-max mx-auto rounded-full bg-green-500 text-white"><CheckCheck size={50}/></div>
              <h1 className="md:text-4xl text-2xl mt-6 font-bold">Payment Succeeded!</h1>
              <p className="mt-6 md:text-lg text-gray-600">Your payment was successful. Thank you for your purchase!</p>
            </>
          ): (
            <div>
                  <h1 className="md:text-4xl text-2xl mt-6 font-bold">No payment details found</h1>
                  <p className="mt-6 md:text-lg text-gray-600">something went wrong</p>
            </div>
          )} 
          <button onClick={() => {location.href = "/"}} className="p-4 font-semibold bg-black mt-6 text-white py-2 px-4 rounded-md text-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 active:bg-gray-900 transition duration-200">
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default Success