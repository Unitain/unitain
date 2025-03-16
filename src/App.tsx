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
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8100/api/getUserData');
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
      await axios.post('http://localhost:8200/api/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('userData');
      setUser(null);
      // window.location.href = 'https://pretest.unitain.net/'
      window.location.href = 'http://localhost:5173/?returnTo=login';
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