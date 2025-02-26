import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../lib/store';
import { fetchChatGPTResponse, saveChatMessage, getChatHistory, type ChatMessage } from '../lib/chat';
import toast from 'react-hot-toast';

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user?.id]);

  const loadChatHistory = async () => {
    if (!user?.id) return;

    try {
      const history = await getChatHistory(user.id);
      if (mounted.current) {
        setMessages(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user?.id || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Add user message to UI immediately
      const userMessageObj = {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: userMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessageObj]);

      // Get AI response
      console.log('Sending message to ChatGPT:', userMessage);
      const response = await fetchChatGPTResponse(userMessage);
      console.log('Received response from ChatGPT:', response);

      if (!response) {
        throw new Error('No response received from ChatGPT');
      }

      if (mounted.current) {
        // Save messages to database
        await Promise.all([
          saveChatMessage(user.id, 'user', userMessage),
          saveChatMessage(user.id, 'assistant', response)
        ]);

        // Add AI response to UI
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      
      // Remove user message from UI if AI response failed
      setMessages(prev => prev.filter(msg => msg.content !== userMessage));
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-sm">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex items-center gap-2 min-w-[80px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send
        </Button>
      </form>
    </div>
  );
}

export default Chat;