import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Save, Key, User } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * SandboxCredentials component
 * 
 * This component allows users to enter and save their Sandbox credentials
 * (Sandbox-UserID & Sandbox-Token) to localStorage.
 * 
 * The credentials are automatically loaded from localStorage when the component mounts.
 */
export function SandboxCredentials() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load credentials from localStorage on component mount
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('sandbox-userId');
      const savedToken = localStorage.getItem('sandbox-token');
      
      if (savedUserId) setUserId(savedUserId);
      if (savedToken) setToken(savedToken);
    } catch (error) {
      console.error('Failed to load sandbox credentials from localStorage:', error);
    }
  }, []);

  // Save credentials to localStorage
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('sandbox-userId', userId);
      localStorage.setItem('sandbox-token', token);
      
      toast.success('Sandbox credentials saved successfully!');
    } catch (error) {
      console.error('Failed to save sandbox credentials to localStorage:', error);
      toast.error('Failed to save credentials. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Key className="w-5 h-5 mr-2 text-primary-600" />
        Sandbox Credentials
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="sandbox-userId" className="block text-sm font-medium text-gray-700 mb-1">
            Sandbox User ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="sandbox-userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
              placeholder="Enter your Sandbox User ID"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="sandbox-token" className="block text-sm font-medium text-gray-700 mb-1">
            Sandbox Token
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="sandbox-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
              placeholder="Enter your Sandbox Token"
            />
          </div>
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Credentials'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          Your credentials are stored locally in your browser and are not sent to any server.
        </p>
      </div>
    </div>
  );
}

export default SandboxCredentials;