import { BrowserRouter ,Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home'
import Login from "./pages/Login"
import { useState } from 'react';

const App = () => {
  const [user, setUser] = useState(null)
  const userData = localStorage.getItem('user'); 

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={user ? < Home/> :  <Navigate to="/login" />} />
        <Route path="login" element={< Login/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;