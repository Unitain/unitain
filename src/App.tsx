// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Header } from './components/Header';
import ErrorPage from './pages/ErrorPage';
import axios from 'axios';
import UnAuthorized from "./pages/UnAuthorized"

const App = () => {
  const [user, setUser] = useState(null);

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
    console.log("hello");
    getUserCookie()
  },[])


  const handleLogout = async () => {
    setUser(null)
    document.cookie = "userData=; Path=/; Domain=.unitain.net; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;";
    document.cookie = "userData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;";
    console.log("✅ Session cleared: Cookies & LocalStorage removed");
    // window.location.href = "http://localhost:5173/?returnTo=login"
    // window.location.href = "https://unitain.net/?returnTo=login"
    localStorage.removeItem('userData')
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
    </BrowserRouter>
  );
};

export default App;