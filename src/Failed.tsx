const ExclamationIcon = () => (
    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )

const Failed = () => {
  return (
    <div className="h-[90vh] flex items-center justify-center p-4">
      <div className="rounded-lg shadow-lg w-full max-w-md  border border-red-500">
        <div className="p-6 text-center">
          <ExclamationIcon />
          <h1 className="text-2xl font-bold mt-4 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            Hey there. We tried to charge your card but, something went wrong. Please update your payment method below
            to continue
          </p>
          <button onClick={()=>{location.href = "/"}} className="w-full bg-black text-white py-2 px-4 rounded-md font-medium text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 active:bg-gray-900 transition duration-200">
            Go Back
          </button>
          <p className="mt-4 text-sm">
            Have a question?{" "}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Failed
