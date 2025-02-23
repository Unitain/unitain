import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Upload, 
  Loader2, 
  Bot, 
  User, 
  X, 
  FileText,
  AlertCircle,
  MessageCircle,
  Download
} from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { DownloadGuide } from './DownloadGuide';
import { uploadVehicleFile } from '../lib/storage';
import { cn } from '../lib/utils';
import { MaterialCard } from './MaterialCard';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FileUpload {
  id: string;
  name: string;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
}

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  action?: () => void;
  buttonText?: string;
  icon: React.ComponentType<any>;
}

export function DashboardChatGPT() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user, isInitialized } = useAuthStore();
  const { t } = useTranslation();
  
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vehicleDataInputRef = useRef<HTMLInputElement>(null);
  const dataSet2InputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setChatVisible(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          localStorage.setItem('nextUrl', window.location.pathname);
          navigate('/');
          toast.error('Please sign in to access the dashboard');
          return;
        }

        if (session.user.id !== userId) {
          navigate('/');
          toast.error('Unauthorized access');
          return;
        }

        setAuthChecked(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/');
        toast.error('Authentication error. Please try again.');
      }
    };

    checkAuth();
  }, [isInitialized, userId, navigate]);

  useEffect(() => {
    if (!chatVisible && messages.length > 0) {
      setUnreadCount(messages.length);
    }
  }, [messages, chatVisible]);

  useEffect(() => {
    if (chatVisible) {
      setUnreadCount(0);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await simulateGPTResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error getting GPT response:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateGPTResponse = async (userMessage: string) => {
    const responses = [
      "I understand your question. Let me analyze that for you...",
      "Based on the data provided, here's what I can tell you...",
      "That's an interesting point. Here's my analysis...",
      "I've processed your request. Here's what I found..."
    ];
    
    return new Promise<string>(resolve => {
      setTimeout(() => {
        resolve(responses[Math.floor(Math.random() * responses.length)] + " [Simulated Response]");
      }, 1500);
    });
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
    if (!chatVisible) {
      setUnreadCount(0);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  };

  const chatInputClasses = cn(
    "flex-1 min-h-[40px] max-h-[100px]",
    "p-2 border rounded-lg text-base",
    "resize-none focus:outline-none focus:ring-2 focus:ring-blue-500",
    "bg-white placeholder-gray-400"
  );

  const sendButtonClasses = cn(
    "flex-shrink-0 flex items-center justify-center",
    "w-10 h-10 rounded-full",
    "bg-blue-600 text-white",
    "hover:bg-blue-700 active:bg-blue-800",
    "disabled:opacity-50 disabled:hover:bg-blue-600",
    "transition-colors duration-200"
  );

  const chatFormClasses = cn(
    "flex items-center gap-2",
    "p-3 bg-white border-t",
    "shadow-sm"
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Chat Button */}
      {isMobile && (
        <button
          onClick={toggleChat}
          className={cn(
            "fixed bottom-4 right-4 z-50",
            "w-12 h-12 rounded-full shadow-lg",
            "flex items-center justify-center",
            "transition-all duration-200",
            unreadCount > 0 ? "bg-red-500" : "bg-blue-600",
            "hover:scale-105 active:scale-95"
          )}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Mobile Chat Panel */}
      {isMobile && chatVisible ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between h-12 px-4 bg-gray-100 border-b">
            <h2 className="text-base font-semibold text-gray-900">
              {t('Chat Assistant')}
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleChat}
              className="w-8 h-8 p-0 flex items-center justify-center"
              aria-label={t('Close chat')}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3",
                  message.role === 'assistant' ? 'bg-blue-50' : ''
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
                ) : (
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-base break-words">{message.content}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={handleSubmit}
            className={chatFormClasses}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('Type your message...')}
              className={chatInputClasses}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={sendButtonClasses}
              aria-label={t('Send message')}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      ) : (
        // Desktop chat interface
        <div className="flex-1 max-w-4xl mx-auto px-4 py-4 w-full">
          <MaterialCard className="flex flex-col h-full bg-white" elevation={2}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3",
                    message.role === 'assistant' ? 'bg-blue-50' : ''
                  )}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-6 h-6 text-blue-600" />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-900">{message.content}</p>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form 
              onSubmit={handleSubmit}
              className={chatFormClasses}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('Type your message...')}
                className={chatInputClasses}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={sendButtonClasses}
                aria-label={t('Send message')}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </MaterialCard>
        </div>
      )}
    </div>
  );
}