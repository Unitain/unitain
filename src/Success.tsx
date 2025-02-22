import {useEffect , useState} from "react";
import {CheckCheck, LogIn, X } from "lucide-react";
import axios from "axios";

const Success = () => {
  const url = new URL(window.location.href);
  const paymentId = url.searchParams.get('paymentId');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
try{
  setLoading(true)
  if(paymentId){
    // axios.get(`http://localhost:8300/payment-status/${paymentId}`)
    axios.get(`https://unitain-server.vercel.app/api/payment-status/${paymentId}`)
    .then((response) => {
      console.log("response", response.data)
      setPaymentStatus(response.data.status);
    })
    .catch((error) => {
        console.error("Error fetching payment status:", error);
    });
  }
}catch(error){
  console.log("error", error);
}finally{
  setLoading(false)
}
}, [paymentId])

  
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
          {(paymentStatus === 'approved' || paymentStatus === 'created') ? (
            <>
              <div className="p-4 w-max mx-auto rounded-full bg-green-500 text-white"><CheckCheck size={50}/></div>
              <h1 className="md:text-4xl text-2xl mt-6 font-bold">Payment Succeeded!</h1>
              <p className="mt-6 md:text-lg text-gray-600">Your payment was successful. Thank you for your purchase!</p>
            </>
          ) : paymentStatus === "failed" ? (
            <>
              <div className="p-4 w-max mx-auto rounded-full bg-red-500 text-white"><X size={50}/></div>
              <h1 className="md:text-4xl text-2xl mt-6 font-bold">Payment Failed!</h1>
              <p className="mt-6 md:text-lg text-gray-600">Sorry, there was an issue with your payment. Please try again.</p>
            </>
          ) : (
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



// const Success = () => {
//   return (
//     <div>
//       hello world
//     </div>
//   )
// }

// export default Success



// import { useEffect, useState } from "react";
// import axios from "axios";

// const Success = () => {
//     const url = new URL(window.location.href);
//     const paymentId = url.searchParams.get('paymentId');
//     console.log("🚀 ~ Success ~ paymentId:", paymentId)
//     const [paymentStatus, setPaymentStatus] = useState(null);
//     console.log("🚀 ~ Success ~ paymentStatus:", paymentStatus)

//     useEffect(() => {
//         if (paymentId) {
//             axios.get(`http://localhost:8300/payment-status/${paymentId}`)
//             axios.get(`https://unitain-server.vercel.app/api/payment-status/${paymentId}`)
//                 .then((response) => {
//                   console.log("response", response)
//                     setPaymentStatus(response.data.status);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching payment status:", error);
//                 });
//         }
//     }, [paymentId]);

//     return (
//         <div className="h-[80vh] flex justify-center items-center">
//             <div className="border rounded-lg p-10 shadow-lg text-center">
//                 <h1 className="text-3xl font-bold">Payment Status</h1>
//                 {paymentStatus ? (
//                     <p className="mt-4 text-lg">Status: {paymentStatus}</p>
//                 ) : (
//                     <p className="mt-4 text-lg">Checking status...</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Success;
