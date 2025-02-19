import { supabase, isSupabaseConfigured, handleSupabaseError } from './supabase';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  metadata?: Record<string, unknown>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;
const MAX_NAME_LENGTH = 100;
const MIN_NAME_LENGTH = 2;

async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    // Remove any HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '');
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function submitContactForm(
  data: ContactFormData,
  retryCount = 0
): Promise<boolean> {
  const requestId = nanoid();
  
  try {
    if (!isSupabaseConfigured()) {
      toast.error('System is temporarily unavailable. Please try again later.');
      return false;
    }

    // Input validation
    if (!data.name || !data.email || !data.message) {
      toast.error('Please fill in all required fields');
      return false;
    }

    const sanitizedName = sanitizeInput(data.name);
    const sanitizedEmail = sanitizeInput(data.email);
    const sanitizedMessage = sanitizeInput(data.message);

    // Length validation
    if (sanitizedName.length < MIN_NAME_LENGTH || sanitizedName.length > MAX_NAME_LENGTH) {
      toast.error(`Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
      return false;
    }

    if (sanitizedMessage.length < MIN_MESSAGE_LENGTH || sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters`);
      return false;
    }

    if (!validateEmail(sanitizedEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const metadata = {
      ...data.metadata,
      requestId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      retryCount
    };

    const { error } = await supabase
      .from('contact_requests')
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        status: 'pending',
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Contact form submission error:', {
        code: error.code,
        message: error.message,
        requestId
      });

      const errorMessage = handleSupabaseError(error);
      
      if (retryCount < MAX_RETRIES && (
        error.code === '42P01' || 
        error.code === '404' || 
        error.status === 404 ||
        error.message?.includes('network')
      )) {
        await wait(RETRY_DELAY * (retryCount + 1));
        return submitContactForm(data, retryCount + 1);
      }

      toast.error(errorMessage);
      return false;
    }

    toast.success('Message sent successfully! We\'ll be in touch soon.');
    return true;
  } catch (err) {
    console.error('Failed to submit contact form:', {
      error: err,
      requestId
    });
    
    if (retryCount < MAX_RETRIES) {
      await wait(RETRY_DELAY * (retryCount + 1));
      return submitContactForm(data, retryCount + 1);
    }
    
    toast.error('Network error. Please check your connection and try again.');
    return false;
  }
}