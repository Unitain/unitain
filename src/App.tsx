import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ErrorPage from './pages/ErrorPage';
import UsersPage from './pages/UsersPage';
import Login from "./pages/Login";
import { useEffect, useState } from 'react';
import { supabase } from "../src/supabase";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // If no localStorage, check Supabase auth
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!authUser) {
          setLoading(false);
          return;
        }

        // Fetch user data from your users table
        const { data: userData, error } = await supabase
          .from('users')
          .select()
          .eq('id', authUser.id)
          .single();

        if (error) throw error;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select()
          .eq('id', session.user.id)
          .single();

        if (!error && userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () =>{
    localStorage.clear();
    const { error } = await supabase.auth.signOut()
    if(error){
      alert("Error in logout", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Header handleLogout={handleLogout} user={user} />
      <Routes>
        <Route path="/" element={user ? <UsersPage /> : <Navigate to="/login" replace />} />
        <Route path="/users" element={<UsersPage />} />
        {/* <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/messages" element={<MessagesPage />} /> */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;