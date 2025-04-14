import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeToS, setActiveToS] = useState(null);
  const [ipAddress, setIpAddress] = useState('');
  
  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch('https://api64.ipify.org?format=json');
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    }
    fetchIP();

    async function fetchActiveTermsOfService() {
      const { data, error } = await supabase
        .from('terms_of_service')
        .select('*')
        .eq('is_active', true)
        .single();
      if (!error) setActiveToS(data);
    }
    fetchActiveTermsOfService();
  }, []);

  function setUserCookie(userData: any) {
    if (!userData) {
        console.error("🚨 No userData provided, cannot set cookie.");
        return;
    }
    const trimmedUserData = {
      id: userData.id,
      email: userData.email,
      created_at: userData.created_at,
      payment_status: userData.payment_status,
      is_eligible: userData.is_eligible,
      ToS_checked: userData.ToS_checked
    };

    console.log("🚀 Setting Cookie: ", trimmedUserData);
    const value = JSON.stringify(trimmedUserData);

    let cookieBase = `userData=${value}; Path=/; Secure; SameSite=None; Expires=Fri, 31 Dec 9999 23:59:59 GMT;`;

    if (window.location.hostname === "localhost") {
        document.cookie = cookieBase;
    } else {
        document.cookie = cookieBase + " Domain=.unitain.net;";
        console.log("✅ Cookie set for unitain.net:", document.cookie);
    }
  }

  const handleEmailConfirmation = async (user: any, pendingSignup: any) => {
    try {
      console.log("Completing signup for:", user.email);
 
      // Insert ToS acceptance record
      const { data: ToSData, error: ToSError } = await supabase
        .from('user_tos_acceptance')
        .insert({
          user_id: user.id,
          tos_version_id: pendingSignup.tosData.tos_version_id,
          ip_address: pendingSignup.tosData.ip_address || ipAddress,
          device_info: pendingSignup.tosData.device_info || navigator.userAgent,
        })
        .select()
        .single();
      if (ToSError) throw ToSError;
      const { error: userError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
        payment_status: "pending",
        is_eligible: false,
        ToS_checked: true,
        tos_acceptance: ToSData.id
      });
  
      if (userError) throw userError;

      localStorage.removeItem('pendingSignup');
      sessionStorage.removeItem('pendingSignup');
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
  
      if (fetchError) throw fetchError;
  
      setUser(userData);
      setUserCookie(userData); 

      toast.success('Email successfully confirmed!');
      navigate("/");
  
    } catch (error) {
      console.error("Full confirmation error:", error);
      toast.error("Confirmation failed. Please try signing in.");
      // navigate("/auth/signin");
      console.log('handleEmailConfirmation wala error')
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token') || params.get('code');
        const type = params.get('type');
        const error = params.get('error');

        if (error) throw new Error(error);

        // Email confirmation flow
        if (token && type === 'signup') {
          const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup') || 'null');
          if (!pendingSignup?.email) {
            // Fallback: Verify token directly to get email
            const { data: tokenData, error: tokenError } = await supabase.auth.verifyOtp({
              token,
              type: 'signup',
            });

            if (tokenError) throw tokenError;
            if (!tokenData.user?.email) throw new Error("Couldn't retrieve email from token");

            pendingSignup = {
              email: tokenData.user.email,
              tosData: {
                tos_version_id: activeToS?.id || 'unknown',
                ip_address: ipAddress || 'unknown',
                device_info: navigator.userAgent,
                timestamp: new Date().toISOString()
              }
            };
          }

          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            email: pendingSignup.email,
            token,
            type: 'signup',
          });
          if (verifyError) throw verifyError;
          if (!data.session?.user) throw new Error("Session creation failed");

          await handleEmailConfirmation(data.session.user, pendingSignup);
          return;
        }

        // Standard session check
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw sessionError || new Error("No active session found");
        }

        // Get full user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (userError) throw userError;

        // Merge and set user
        const mergedUser = { ...sessionData.session.user, ...(userData || {}) };
        setUser(mergedUser);
        setUserCookie(mergedUser);
        // navigate("/");

      } catch (error) {
        console.error("Authentication error:", error);
        toast.error(error instanceof Error ? error.message : "Authentication failed");
        console.log('useEffect wala error')
        // navigate("/auth/signin");
      }
    };

    handleAuthCallback();
  }, [navigate, setUser, activeToS, ipAddress]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Completing authentication...</p>
    </div>
  );
}