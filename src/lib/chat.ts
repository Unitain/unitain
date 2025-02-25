import { supabase } from './supabase';
import toast from 'react-hot-toast';
import { getTimezone } from './utils';
import { fetchChatGPTResponse } from './api';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

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