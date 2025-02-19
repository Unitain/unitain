import { supabase, isSupabaseConfigured } from './supabase';
import toast from 'react-hot-toast';

export interface EligibilityCheckData {
  answers: Record<string, string>;
  isEligible: boolean;
  metadata?: Record<string, unknown>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function saveEligibilityCheck(
  data: EligibilityCheckData, 
  retryCount = 0
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured');
    toast.error('System is temporarily unavailable. Please try again later.');
    return false;
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      toast.error('Please sign in to save your results.');
      return false;
    }
    
    if (!session?.user) {
      console.error('No active session');
      toast.error('Please sign in to save your results.');
      return false;
    }

    // Validate data before sending
    if (!data.answers || Object.keys(data.answers).length === 0) {
      console.error('Invalid answers data');
      toast.error('Please complete all questions before submitting.');
      return false;
    }

    const { error: insertError } = await supabase
      .from('eligibility_checks')
      .insert({
        user_id: session.user.id,
        answers: data.answers,
        is_eligible: data.isEligible,
        metadata: {
          ...data.metadata,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          retryCount,
          version: '1.0.0'
        }
      });

    if (insertError) {
      console.error('Save error:', insertError);

      // Handle specific error cases
      if (insertError.code === '42P01' && retryCount < MAX_RETRIES) {
        console.log(`Retrying save (${retryCount + 1}/${MAX_RETRIES})...`);
        await wait(RETRY_DELAY * (retryCount + 1));
        return saveEligibilityCheck(data, retryCount + 1);
      }

      toast.error('Failed to save your eligibility check. Please try again.');
      return false;
    }

    toast.success('Your eligibility check has been saved!');
    return true;
  } catch (err) {
    console.error('Failed to save eligibility check:', err);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying save (${retryCount + 1}/${MAX_RETRIES})...`);
      await wait(RETRY_DELAY * (retryCount + 1));
      return saveEligibilityCheck(data, retryCount + 1);
    }
    
    toast.error('Network error. Please check your connection and try again.');
    return false;
  }
}