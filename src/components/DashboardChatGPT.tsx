import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { LoadingSpinner } from './LoadingSpinner';
import { Upload } from './Upload';
import { Download } from './Download';
import { Chat } from './Chat';
import toast from 'react-hot-toast';

export function DashboardChatGPT() {
  const { user, isInitialized } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!user) {
          console.warn('No user found in dashboard, redirecting to login...');
          navigate('/auth/signin');
          return;
        }

        // Verify the session is still valid
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.error('Session validation failed:', error);
          toast.error('Your session has expired. Please sign in again.');
          navigate('/auth/signin');
          return;
        }

        if (mounted.current) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Dashboard session check failed:', error);
        toast.error('Failed to load dashboard. Please try again.');
        navigate('/auth/signin');
      }
    };

    if (isInitialized) {
      checkSession();
    }
  }, [user, isInitialized, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Welcome to Your Dashboard</h1>
      
      {/* Upload and Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <Upload />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Download Guide</h2>
          <Download />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Chat Support</h2>
        <Chat />
      </div>
    </div>
  );
}

export default DashboardChatGPT;