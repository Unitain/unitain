import { supabase } from './supabase';
import toast from 'react-hot-toast';

interface ChatGPTResponse {
  message: string;
  error?: string;
}

export async function fetchChatGPTResponse(message: string): Promise<string> {
  try {
    if (!message?.trim()) {
      throw new Error('Message cannot be empty');
    }

    console.log('📡 Sending request to ChatGPT API:', message);

    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/chatgpt-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({ message })
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json();
      console.error('ChatGPT API error:', error);
      throw new Error(error.error || 'Failed to get response from ChatGPT');
    }

    const data: ChatGPTResponse = await response.json();
    console.log('📡 Received response from ChatGPT API:', data);

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