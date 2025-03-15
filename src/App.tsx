// App.js
import React from 'react';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Header } from './components/Header';
import ErrorPage from './pages/ErrorPage';

const App = () => {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;