import { supabase } from './supabase';
import toast from 'react-hot-toast';

interface ChatGPTResponse {
  message: string;
  error?: string;
}

export async function fetchChatGPTResponse(message: string): Promise<string> {
  try {
    console.log("📡 Sending request to ChatGPT API via Supabase:", message);

    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/chatgpt-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response from ChatGPT');
    }

    const data = await response.json();
    console.log("📡 Received response from ChatGPT API:", data);
    
    if (!data.message) {
      throw new Error('Invalid response format from ChatGPT proxy');
    }

    return data.message;
  } catch (error) {
    console.error('ChatGPT API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get response from ChatGPT';
    toast.error(errorMessage);
    throw error;
  }
}