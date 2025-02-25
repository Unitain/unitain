import { supabase } from '../lib/supabase';

interface ChatGPTResponse {
  message?: string;
  error?: string;
}

export async function sendMessageToChatGPT(message: string): Promise<string> {
  try {
    console.log("📡 Sending request to ChatGPT API:", message);

    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/chatgpt-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({ message })
    });

    const data: ChatGPTResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response from ChatGPT');
    }

    if (!data.message) {
      throw new Error('Invalid response format from ChatGPT proxy');
    }

    console.log("📡 Received response from ChatGPT API:", data);
    return data.message;
  } catch (error) {
    console.error('ChatGPT API error:', error);
    throw error instanceof Error ? error : new Error('Failed to communicate with ChatGPT');
  }
}