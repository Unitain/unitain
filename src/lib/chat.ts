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
      console.debug(`Failed to save chat message for user ${userId}:`, error);
      // Don't throw for non-critical errors
      if (error.message !== 'JWT expired' && !error.message.includes('not found')) {
        throw error;
      }
    }
  } catch (error) {
    console.debug('Failed to save chat message:', error);
    // Only show error toast for critical errors
    if (error instanceof Error && !error.message.includes('JWT')) {
      toast.error('Failed to save message');
    }
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
      // Don't throw for auth errors
      if (error.message !== 'JWT expired' && !error.message.includes('not found')) {
        throw error;
      }
      return [];
    }

    return data.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.debug('Failed to fetch chat history:', error);
    // Only show error toast for critical errors
    if (error instanceof Error && !error.message.includes('JWT')) {
      toast.error('Failed to load chat history');
    }
    return [];
  }
}

export async function clearChatHistory(userId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('chat_functions.clear_chat_history', {
      p_user_id: userId
    });

    if (error) {
      // Don't throw for auth errors
      if (error.message !== 'JWT expired' && !error.message.includes('not found')) {
        throw error;
      }
    }
    toast.success('Chat history cleared');
  } catch (error) {
    console.debug('Failed to clear chat history:', error);
    // Only show error toast for critical errors
    if (error instanceof Error && !error.message.includes('JWT')) {
      toast.error('Failed to clear chat history');
    }
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