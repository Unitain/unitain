import { LockKeyhole } from "lucide-react"
import { Link } from "react-router-dom"

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-primary-50 p-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
              <LockKeyhole className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Access Restricted</h1>

            <div>
              <p className="text-lg mb-2 font-medium text-gray-700">User not found</p>
              <p className="text-gray-500 mb-6">Please login first to access app.unitain</p>
            </div>

            <Link to="https://unitain.net/?returnTo=login" className="inline-block w-full">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Login to Continue
              </button>
            </Link>

            <p className="mt-6 text-sm text-gray-400">
              Need help?{" "}
              <Link to="/contact" className="text-primary-600 hover:underline">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

