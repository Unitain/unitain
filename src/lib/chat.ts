import { supabase } from './supabase';
import toast from 'react-hot-toast';
import { addSystemMessage } from './chat';
import { getTimezone } from './utils';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export async function fetchChatGPTResponse(message: string): Promise<string> {
  try {
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
    return data;
  } catch (error) {
    console.error('ChatGPT API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get response from ChatGPT';
    toast.error(errorMessage);
    throw error;
  }
}

export async function saveChatMessage(userId: string, role: 'user' | 'assistant' | 'system', content: string): Promise<void> {
  try {
    const timezone = getTimezone();
    const { error } = await supabase.rpc('chat_functions.add_chat_message', {
      p_user_id: userId,
      p_role: role,
      p_content: content,
      p_timezone: timezone
    });

    if (error) {
      console.error(`Failed to save chat message for user ${userId}:`, error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save chat message:', error);
    toast.error('Failed to save message');
    throw error;
  }
}

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  try {
    const timezone = getTimezone();
    const { data, error } = await supabase.rpc('chat_functions.get_chat_history', {
      p_user_id: userId,
      p_timezone: timezone
    });

    if (error) {
      console.error('Failed to fetch chat history:', error);
      throw error;
    }

    return data.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    toast.error('Failed to load chat history');
    return [];
  }
}

export async function clearChatHistory(userId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('chat_functions.clear_chat_history', {
      p_user_id: userId
    });

    if (error) {
      console.error('Failed to clear chat history:', error);
      throw error;
    }
    toast.success('Chat history cleared');
  } catch (error) {
    console.error('Failed to clear chat history:', error);
    toast.error('Failed to clear chat history');
    throw error;
  }
}

// System message functions
export function addSystemMessage(message: string): void {
  const event = new CustomEvent('chat-message', {
    detail: {
      message,
      sender: 'system',
      timestamp: new Date()
    }
  });
  window.dispatchEvent(event);
}

export const addChatMessage = addSystemMessage;