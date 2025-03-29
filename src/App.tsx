// App.js
import { useEffect, useState } from 'react';
import { BrowserRouter ,Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Header } from './components/Header';
import ErrorPage from './pages/ErrorPage';
import UnAuthorized from "./pages/UnAuthorized"

const App = () => {
  const [user, setUser] = useState(null);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [hasUnverifiedImages ,setHasUnverifiedImages] = useState(false)

function getUserCookie() {
  const cookies = document.cookie.split("; ");

  for (let cookie of cookies) {
    let [name, value] = cookie.split("=");
      if (name === "userData") {
          try {
            setUser(JSON.parse(value))
            localStorage.setItem('userData', value)
            return JSON.parse(decodeURIComponent(value)); 
          } catch (error) {
              console.error("Error parsing userData cookie:", error);
              return null;
          }
      }
  }

  return null; 
}

  useEffect(()=>{
    getUserCookie()
    const sessionImages = JSON.parse(sessionStorage.getItem('allImages') || '[]');
    setHasUnverifiedImages(sessionImages.some(img => !img.verified));
  },[])

  const performLogout = () => {
    setUser(null)
      document.cookie = "userData=; Path=/; Domain=unitain.net; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;";
      document.cookie = "userData=; Path=/; Domain=.unitain.net; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;";
      document.cookie = "userData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;";


    console.log("✅ Session cleared: Cookies & LocalStorage removed");
    window.location.href = "https://unitain.net/?returnTo=login";
    // window.location.href = "http://localhost:5173/?returnTo=login"
    localStorage.removeItem('userData')
    localStorage.removeItem('savedImages')
    localStorage.removeItem('paymentStatus')

  };

  const handleLogout = () => {
    const sessionImages = JSON.parse(sessionStorage.getItem('allImages') || '[]');
    const hasUnverified = sessionImages.some(img => !img.verified);
    
    if (hasUnverified) {
      setShowLogoutWarning(true);
    } else {
      performLogout();
    }
  };

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout}/>
      <Routes>
      {user ? (
        <Route path="/" element={<Dashboard />} />
       ): (
        <Route path="/" element={<UnAuthorized />} />
       )}
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {showLogoutWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unsaved Changes</h3>
            <p className="text-gray-600 mb-6">
              You have unverified images that will be lost if you logout.
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutWarning(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={performLogout}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Logout Anyway
              </button>
            </div>
          </div>
        </div>
      )}

    </BrowserRouter>
  );
};

export default App;