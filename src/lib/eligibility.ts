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
export async function saveEligibilityCheck(data: EligibilityCheckData, retryCount = 0): Promise<boolean> {

  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured.");
    return false;
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session error:", sessionError);
      return false;
    }

    if (!sessionData?.session?.user) {
      console.error("No active session.");
      return false;
    }

    const userId = sessionData.session.user.id;
    if (!data.answers || Object.keys(data.answers).length === 0) {
      console.error("Invalid answers data:", data.answers);
      return false;
    }

    const insertPayload = {
      user_id: userId,
      answers: data.answers,
      is_eligible: data.isEligible,
      metadata: {
        ...data.metadata,
        timestamp: new Date().toISOString(),
      }
    };

    console.log("Insert Payload:", insertPayload);

    const { data: insertData, error: insertError } = await supabase
      .from("eligibility_checks")
      .insert(insertPayload)
      .select();

    console.log("Insert Response:", insertData);

    if (insertError) {
      console.error("Insert Error:", insertError);

      // Handle specific error cases
      if (insertError.code === '42P01' && retryCount < MAX_RETRIES) {
        console.log(`Retrying save (${retryCount + 1}/${MAX_RETRIES})...`);
        await wait(RETRY_DELAY * (retryCount + 1));
        return saveEligibilityCheck(data, retryCount + 1);
      }

      toast.error('Failed to save your eligibility check. Please try again.');
      return false;
    }

    console.log("Data saved successfully!");
    return true;
  } catch (error) {
    console.error("Unexpected error in saveEligibilityCheck:", error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying save (${retryCount + 1}/${MAX_RETRIES})...`);
      await wait(RETRY_DELAY * (retryCount + 1));
      return saveEligibilityCheck(data, retryCount + 1);
    }
    
    toast.error('Network error. Please check your connection and try again.');
    return false;
  }
}