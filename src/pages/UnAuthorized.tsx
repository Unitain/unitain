import { LockKeyhole } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";

export default function Unauthorized() {
  const { t } = useTranslation();

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
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {t("unauthorized.title")}
            </h1>

            <div>
              <p className="text-lg mb-2 font-medium text-gray-700">
                {t("unauthorized.message")}
              </p>
              <p className="text-gray-500 mb-6">
                {t("unauthorized.description")}
              </p>
            </div>

            <Link to="https://unitain.net/?returnTo=login" className="inline-block w-full">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                {t("unauthorized.loginButton")}
              </button>
            </Link>

            <p className="mt-6 text-sm text-gray-400">
              {t("unauthorized.help")}{" "}
              <Link to="/contact" className="text-primary-600 hover:underline">
                {t("unauthorized.contact")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

