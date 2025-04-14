import { useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  function setUserCookie(userData: any) {
    if (!userData) return;
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
  }

  const completeRegistration = async (user: any) => {
    try {
      // Check if user already exists in the users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (userCheckError) {
        console.error("Error checking existing user:", userCheckError);
      }
      
      // If user already exists, just update the session
      if (existingUser) {
        console.log("User already exists in database, updating session");
        setUser(existingUser);
        setUserCookie(existingUser);
        toast.success('Login successful!');
        navigate("/");
        return;
      }
      
      // Get TOS data from user_metadata
      const tosData = user.user_metadata?.tos_data;
      
      if (!tosData?.version) {
        throw new Error("Terms of Service acceptance not found");
      }

      // 1. Record TOS acceptance
      const { data: tosRecord, error: tosError } = await supabase
        .from('user_tos_acceptance')
        .insert({
          user_id: user.id,
          tos_version_id: tosData.version,
          ip_address: tosData.ip || 'unknown',
          device_info: tosData.device || navigator.userAgent.slice(0, 100)
        })
        .select()
        .single();

      if (tosError) throw tosError;

      // 2. Create user profile
      const { error: userError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
        payment_status: "pending",
        is_eligible: false,
        ToS_checked: true,
        tos_acceptance: tosRecord.id
      });

      if (userError) throw userError;

      // 3. Get complete user data
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      setUser(userData);
      setUserCookie(userData);
      toast.success('Registration complete!');
      // navigate("/");

    } catch (error) {
      console.error("Registration completion error:", error);
      toast.error("Registration failed. Please try signing in.");
      // navigate("/");
    }
  };

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const type = params.get('type');
        const email = params.get('email');

        console.log("Auth callback params:", { code, type, email });

        // 1. Handle email confirmation
        if (code && type === 'signup') {
          try {
            // Try to get the session directly
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error("Session error:", sessionError);
              throw sessionError;
            }
            
            if (session?.user) {
              // We have a valid session, complete registration
              await completeRegistration(session.user);
              return;
            }
            
            // If no session, try to verify the email
            if (email) {
              // Try to sign in with the email
              const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                  shouldCreateUser: false
                }
              });
              
              if (signInError) {
                console.error("Sign in error:", signInError);
                throw signInError;
              }
              
              toast.success("Verification email sent. Please check your inbox.");
              navigate("/");
              return;
            }
            
            // If we get here, we couldn't verify the email
            toast.error("Verification failed. Please try signing up again.");
            navigate("/");
            return;
          } catch (flowError) {
            console.error("Flow error:", flowError);
            toast.error("Verification failed. Please try signing up again.");
            navigate("/");
            return;
          }
        }

        // 2. Handle regular session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw sessionError || new Error("Please sign in to continue");
        }

        // Get full user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Merge auth and profile data
        const mergedUser = { ...session.user, ...(userData || {}) };
        setUser(mergedUser);
        setUserCookie(mergedUser);
        navigate("/");

      } catch (err) {
        console.error("Authentication error:", err);
        toast.error(err instanceof Error ? err.message : "Authentication failed");
        navigate("/");
      }
    };

    handleAuth();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Completing authentication...</p>
    </div>
  );
}