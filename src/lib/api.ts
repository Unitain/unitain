import { supabase } from './supabase';
import toast from 'react-hot-toast';

interface ChatGPTResponse {
  message: string;
  error?: string;
}

export async function fetchChatGPTResponse(message: string): Promise<string> {
  try {
    if (!message?.trim()) {
      throw new Error("Invalid request: message is undefined.");
    }

    console.log("📡 Sending request to ChatGPT API:", message);

    const requestBody = JSON.stringify({ message });
    console.log("📝 Request Payload:", requestBody);

    const apiUrl = `${supabase.supabaseUrl}/functions/v1/chatgpt-proxy`;
    console.log("🌍 API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: requestBody
    });

    console.log("🌍 API Status Code:", response.status);
    console.log("🌍 API Headers:", Object.fromEntries(response.headers.entries()));

    const data: ChatGPTResponse = await response.json();
    console.log("📡 Received response from ChatGPT API:", data);

    if (!response.ok) {
      console.error("❌ API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: data.error
      });
      throw new Error(data.error || 'Failed to get response from ChatGPT');
    }

    if (!data.message) {
      console.error("❌ Invalid response format:", data);
      throw new Error('Invalid response format from ChatGPT proxy');
    }

    console.log("✅ Successfully received response:", {
      messageLength: data.message.length,
      timestamp: new Date().toISOString()
    });

    return data.message;
  } catch (error) {
    console.error('ChatGPT API error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to communicate with ChatGPT');
    throw error;
  }
}