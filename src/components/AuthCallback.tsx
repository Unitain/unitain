// import React, { useEffect } from 'react'
// import { useAuthStore } from '../lib/store';
// import { supabase } from '../lib/supabase';
// import { LoadingSpinner } from './LoadingSpinner';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// export function AuthCallback() {
//   const { setUser } = useAuthStore();
//   const navigate = useNavigate();
  
//   const handleEmailConfirmation = async (user: any, pendingSignup: any) => {
//     try {
//       console.log("Starting email confirmation for user:", user.email);
      
//       console.log("🚀 ~ handleEmailConfirmation ~ pendingSignup:", pendingSignup)
//       if (!pendingSignup) {
//         throw new Error("No pending signup data found in localStorage");
//       }
  
//       // 1. First insert ToS acceptance record
//       console.log("Inserting ToS acceptance record...");
//       const { data: ToSData, error: ToSError } = await supabase
//         .from('user_tos_acceptance')
//         .insert({
//           user_id: user.id,
//           tos_version_id: pendingSignup.tosData.tos_version_id,
//           ip_address: pendingSignup.tosData.ip_address,
//           device_info: pendingSignup.tosData.device_info,
//         })
//         .select()
//         .single();
  
//       if (ToSError) {
//         console.error("ToS insertion error:", ToSError);
//         throw ToSError;
//       }
  
//       // 2. Then insert user record
//       console.log("Inserting user record...");
//       const { error: userError } = await supabase.from("users").upsert({
//         id: user.id,
//         email: user.email,
//         created_at: new Date().toISOString(),
//         payment_status: "pending",
//         is_eligible: false,
//         ToS_checked: true,
//         tos_acceptance: ToSData.id
//       });
  
//       if (userError) {
//         console.error("User insertion error:", userError);
//         throw userError;
//       }
  
//       // 3. Clean up and finalize
//       localStorage.removeItem('pendingSignup');
//       console.log("Signup data cleared from localStorage");
  
//       const { data: userData, error: fetchError } = await supabase
//         .from("users")
//         .select("*")
//         .eq("id", user.id)
//         .single();
  
//       if (fetchError) throw fetchError;
  
//       // 5. Update application state
//       setUser(userData);
//       toast.success('Email successfully confirmed!');
//       console.log("User confirmed and redirected");
//       navigate("/");
  
//     } catch (error) {
//       console.error("Full confirmation error:", error);
//       toast.error("Confirmation failed. Please try signing in.");
//       navigate("/auth/signin");
//     }
//   };

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       console.log("Auth callback initiated");
      
//       try {
//         const params = new URLSearchParams(window.location.search);
//         const token = params.get('token') || params.get('code');
//         const type = params.get('type');
  
//         console.log("URL params:", { token, type });
  
//         // Email confirmation flow
//         if (token && type === 'signup') {
//           console.log("Processing email confirmation...");
          
//           const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup') || 'null');
//           console.log("Pending signup data:", pendingSignup);
  
//           if (!pendingSignup?.email) {
//             throw new Error("Couldn't find your signup data. Please sign up again.");
//           }
  
//           console.log("Verifying OTP for email:", pendingSignup.email);
//           const { data, error } = await supabase.auth.verifyOtp({
//             email: pendingSignup.email,
//             token,
//             type: 'signup',
//           });
  
//           console.warn("data", data)
//           if (error) {
//             console.error("OTP verification failed:", error);
//             throw error;
//           }
  
//           if (!data.session?.user) {
//             throw new Error("Session creation failed");
//           }
  
//           console.log("OTP verified, session created for:", data.session.user.email);
//           await handleEmailConfirmation(data.session.user, pendingSignup);
//           return;
//         }
  
//         // Standard session check
//         console.log("Checking existing session...");
//         const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
//         if (sessionError || !sessionData.session) {
//           console.error("Session check failed:", sessionError);
//           throw sessionError || new Error("No active session found");
//         }
  
//         console.log("User session found:", sessionData.session.user.email);
//         setUser(sessionData.session.user);
//         navigate("/");
  
//       } catch (error) {
//         console.error("Authentication process failed:", error);
//         toast.error(
//           error instanceof Error ? error.message : "Authentication failed"
//         );
//         navigate("/auth/signin");
//       }
//     };
  
//     handleAuthCallback();
//   }, [navigate, setUser]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <LoadingSpinner size="lg" />
//       <p className="mt-4 text-gray-600">Completing authentication...</p>
//     </div>
//   );
// }


import React, { useEffect } from 'react'
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  
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
      console.log("Starting email confirmation for user:", user.email);
      
      if (!pendingSignup) {
        throw new Error("No pending signup data found in localStorage");
      }
  
      // Insert ToS acceptance record
      const { data: ToSData, error: ToSError } = await supabase
        .from('user_tos_acceptance')
        .insert({
          user_id: user.id,
          tos_version_id: pendingSignup.tosData.tos_version_id,
          ip_address: pendingSignup.tosData.ip_address,
          device_info: pendingSignup.tosData.device_info,
        })
        .select()
        .single();
  
      if (ToSError) throw ToSError;
  
      // Insert user record
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
      navigate("/auth/signin");
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token') || params.get('code');
        const type = params.get('type');
  
        // Email confirmation flow
        if (token && type === 'signup') {
          const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup') || 'null');
          if (!pendingSignup?.email) {
            throw new Error("Couldn't find your signup data. Please sign up again.");
          }
  
          const { data, error } = await supabase.auth.verifyOtp({
            email: pendingSignup.email,
            token,
            type: 'signup',
          });
  
          if (error) throw error;
          if (!data.session?.user) throw new Error("Session creation failed");
  
          await handleEmailConfirmation(data.session.user, pendingSignup);
          return;
        }
  
        // Standard session check
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          throw sessionError || new Error("No active session found");
        }
  
        // Get full user data including custom fields
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
  
        if (userError) throw userError;
  
        // Merge auth user with database user
        const mergedUser = { ...sessionData.session.user, ...(userData || {}) };
  
        // Set user in state AND cookie
        setUser(mergedUser);
        setUserCookie(mergedUser); // Add this line

        navigate("/");
  
      } catch (error) {
        console.error("Authentication process failed:", error);
        toast.error(
          error instanceof Error ? error.message : "Authentication failed"
        );
        navigate("/auth/signin");
      }
    };
  
    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Completing authentication...</p>
    </div>
  );
}