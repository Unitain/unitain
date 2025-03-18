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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("fetching user... with unitain-server");
    
    const fetchUserData = async () => {
      try {
        // const response = await axios.get("http://localhost:8500/api/getUserData")
        const response = await axios.get("https://unitain-server.vercel.app/api/getUserData")
        let userData = response.data;

        if (typeof userData === 'string') {
          userData = userData.replace(/^"|"$/g, ''); 
          userData = JSON.parse(userData); 
        }
        if (userData) {
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData)); 
        } else {
          console.log('No userData received from backend.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  console.log("user", user);
  
  const handleLogout = async () => {
    try {
      console.log("user?.id", user?.id);
      
      await axios.post('https://unitain-server.vercel.app/api/logout', {userId: user?.id});
      // await axios.post('http://localhost:8600/api/logout', {userId: user?.id});
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('userData');
      setUser(null);
      // window.location.href = 'http://localhost:5173/?returnTo=login'
      window.location.href = 'https://pretest.unitain.net/?returnTo=login';
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
    </BrowserRouter>
  );
};

export default App;