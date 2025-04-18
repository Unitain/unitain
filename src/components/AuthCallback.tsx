// import { useEffect, useState } from 'react';
// import { useAuthStore } from '../lib/store';
// import { supabase } from '../lib/supabase';
// import { LoadingSpinner } from './LoadingSpinner';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// export function AuthCallback() {
//   const { setUser } = useAuthStore();
//   const navigate = useNavigate();
//   const [ipAddress, setIpAddress] = useState('');
//   const [activeToS, setActiveTos] = useState(null)

//   const setUserCookie = (userData: any) => {
//     if (!userData) {
//       console.error("🚨 No userData provided, cannot set cookie.");
//       return;
//     }
//     const trimmedUserData = {
//       id: userData.id,
//       email: userData.email,
//       created_at: userData.created_at,
//       payment_status: userData.payment_status,
//       is_eligible: userData.is_eligible,
//       ToS_checked: userData.ToS_checked
//     };

//     const value = JSON.stringify(trimmedUserData);
//     let cookieBase = `userData=${value}; Path=/; Secure; SameSite=None; Expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
//     if (window.location.hostname === "localhost") {
//       document.cookie = cookieBase;
//     } else {
//       document.cookie = cookieBase + " Domain=.unitain.net;";
//     }
//   };


//   const fetchActiveTermsOfService = async () => {
//     const { data, error } = await supabase
//       .from('terms_of_service')
//       .select('*')
//       .eq('is_active', true)
//       .single();
      
//     console.log("🚀 ~  data:", data)

//     if(error){
//       console.error("error", error);
//       return
//     }
//     setActiveTos(data)
//   };

//   useEffect(() => {
//     fetchActiveTermsOfService()

//     async function fetchIP() {
//       try {
//         const res = await fetch('https://api64.ipify.org?format=json');
//         const data = await res.json();
//         setIpAddress(data.ip);
//       } catch (error) {
//         console.error('Error fetching IP:', error);
//       }
//     }
//     fetchIP();
//   }, []);

//   const handleAuthCallback = async () => {
//     console.log("activeToS", activeToS);
    
//     try {
//       const params = new URLSearchParams(window.location.search);
//       const token = params.get('code');
//       const type = params.get('type');
//       const email = params.get('email'); 
//       const error = params.get('error');

//       console.log("params", params);
//       console.log("token", token);
//       console.log("type", type);
//       console.log("error", error);
//       console.log(token && type === 'signup');
      
      
//       if (error) throw new Error(error);

//       if (token && type === 'signup') {
//           if (!email) throw new Error("Email is required for verification");
//           const { data: tokenData, error: tokenError } = await supabase.auth.verifyOtp({ token, type: 'signup', email });
//         console.log("🚀 tokenData:", tokenData)
        
//         if (tokenError) throw tokenError;
//         if (!tokenData.user?.email) throw new Error("Couldn't retrieve email from token");
//         const user = tokenData.user;

//         const { data: ToSData, error: ToSError } = await supabase.from('user_tos_acceptance').insert({
//           user_id: user.id,
//           tos_version_id: activeToS?.id,
//           ip_address: ipAddress,
//           device_info: navigator.userAgent,

//         }).select().single();

//         console.log("ToSData", ToSData);
//         if (ToSError) throw ToSError;

//         const { error: userError } = await supabase.from("users").upsert({
//           id: user.id,
//           email: user.email,
//           created_at: new Date().toISOString(),
//           payment_status: "pending",
//           is_eligible: false,
//           ToS_checked: true,
//           tos_acceptance: ToSData.id
//         });

//         if (userError) throw userError;

//         // After user creation, fetch user data
//         const { data: userData, error: fetchError } = await supabase
//           .from("users")
//           .select("*")
//           .eq("id", user.id)
//           .single();

//         if (fetchError) throw fetchError;

//         setUser(userData);
//         setUserCookie(userData);

//         toast.success('Email successfully confirmed!');
//         navigate("/");
//       }

//       // Standard session check
//       const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//       if (sessionError || !sessionData.session) {
//         throw sessionError || new Error("No active session found");
//       }

//       const { data: userData, error: userError } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', sessionData.session.user.id)
//         .single();

//       if (userError) throw userError;

//       const mergedUser = { ...sessionData.session.user, ...(userData || {}) };
//       setUser(mergedUser);
//       setUserCookie(mergedUser);

//     } catch (error) {
//       console.error("Authentication error:", error);
//       toast.error(error instanceof Error ? error.message : "Authentication failed");
//     }
//   };

//   useEffect(() => {
//     handleAuthCallback();
//   }, [navigate, setUser]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <LoadingSpinner size="lg" />
//       <p className="mt-4 text-gray-600">Completing authentication...</p>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [ipAddress, setIpAddress] = useState('');
  const [activeToS, setActiveTos] = useState(null);

  const setUserCookie = (userData: any) => {
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

    const value = JSON.stringify(trimmedUserData);
    let cookieBase = `userData=${value}; Path=/; Secure; SameSite=None; Expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    if (window.location.hostname === "localhost") {
      document.cookie = cookieBase;
    } else {
      document.cookie = cookieBase + " Domain=.unitain.net;";
    }
  };

  const fetchActiveTermsOfService = async () => {
    const { data, error } = await supabase
      .from('terms_of_service')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error("Error fetching active terms of service:", error);
      return;
    }
    setActiveTos(data);
  };

  useEffect(() => {
    fetchActiveTermsOfService();
    
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
  }, []);

  const handleAuthCallback = async () => {
    // Wait for both activeToS and ipAddress to be available
    if (!activeToS || !ipAddress) {
      console.error("🚨 Missing Terms of Service or IP Address");
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('code');
      const type = params.get('type');
      const email = params.get('email');
      const is_eligible = params.get('is_eligible') === 'true';
      console.log("🚀 ~ handleAuthCallback ~ is_eligible:", is_eligible)
      const error = params.get('error');

      if (error) throw new Error(error);

      if (token && type === 'signup') {
        if (!email) throw new Error("Email is required for verification");
        
        const { data: tokenData, error: tokenError } = await supabase.auth.verifyOtp({ token, type: 'signup', email });
        
        if (tokenError) throw tokenError;
        if (!tokenData.user?.email) throw new Error("Couldn't retrieve email from token");

        const user = tokenData.user;

        // Insert ToS acceptance record with activeToS and ipAddress
        const { data: ToSData, error: ToSError } = await supabase.from('user_tos_acceptance').insert({
          user_id: user.id,
          tos_version_id: activeToS?.id,
          ip_address: ipAddress,
          device_info: navigator.userAgent,
        }).select().single();

        if (ToSError) throw ToSError;

        // Insert user data
        const { error: userError } = await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          payment_status: "pending",
          is_eligible,
          ToS_checked: true,
          tos_acceptance: ToSData.id
        });

        if (userError) throw userError;

        // Fetch user data after user creation
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (fetchError) throw fetchError;

        setUser(userData);
        setUserCookie(userData);

        toast.success('Email successfully confirmed!');
        if(is_eligible){
          window.location.href = "https://app.unitain.net";
        }else{
        navigate("/");
        }
      }

      // Standard session check
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw sessionError || new Error("No active session found");
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (userError) throw userError;

      const mergedUser = { ...sessionData.session.user, ...(userData || {}) };
      setUser(mergedUser);
      setUserCookie(mergedUser);

    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    }
  };

  useEffect(() => {
    handleAuthCallback();
  }, [navigate, setUser, activeToS, ipAddress]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Completing authentication...</p>
    </div>
  );
}
