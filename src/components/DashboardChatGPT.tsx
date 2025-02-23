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

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    {
      id: 1,
      title: 'Download Guide',
      description: 'Get started with our comprehensive guide',
      status: 'active',
      icon: FileText
    },
    {
      id: 2,
      title: 'Upload Vehicle Data',
      description: 'Upload your vehicle documentation',
      status: 'pending',
      buttonText: 'Upload',
      action: () => vehicleDataInputRef.current?.click(),
      icon: Upload
    },
    {
      id: 3,
      title: 'Upload Data Set 2',
      description: 'Upload additional required documents',
      status: 'pending',
      buttonText: 'Upload',
      action: () => dataSet2InputRef.current?.click(),
      icon: Upload
    },
    {
      id: 4,
      title: 'Result Status',
      description: 'Processing status of your documents',
      status: 'pending',
      icon: AlertCircle
    }
  ]);

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

  useEffect(() => {
    const handleChatMessage = (event: CustomEvent) => {
      const { message, sender } = event.detail;
      const newMessage: Message = {
        id: Date.now().toString(),
        role: sender,
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      if (!chatVisible) {
        setUnreadCount(prev => prev + 1);
      }
    };

    window.addEventListener('chat-message', handleChatMessage as EventListener);
    return () => window.removeEventListener('chat-message', handleChatMessage as EventListener);
  }, [chatVisible]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    setLoading(true);
    // Download implementation would go here
    setTimeout(() => setLoading(false), 2000);
  };

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
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-none bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-4"
          )}>
            <MaterialCard 
              className="p-4 bg-white"
              elevation={2}
              hover
            >
              <div className="flex items-center gap-3 mb-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium">Download Guide</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Get started with our comprehensive guide
              </p>
              <Button
                onClick={handleDownload}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Guide
                  </>
                )}
              </Button>
            </MaterialCard>

            {/* Upload sections with MaterialCard */}
            {/* ... (similar pattern for upload sections) */}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {isMobile ? (
        <>
          {/* Mobile Chat Button */}
          <button
            onClick={toggleChat}
            className={cn(
              "fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-50",
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

          {/* Mobile Chat Panel */}
          {chatVisible && (
            <MaterialCard
              className="fixed inset-0 z-50 flex flex-col bg-white"
              elevation={4}
            >
              <div className="flex-none p-4 bg-gray-100 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Chat Assistant</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleChat}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

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
              </div>

              <div className="flex-none border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </div>
            </MaterialCard>
          )}
        </>
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

            <div className="flex-none border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </MaterialCard>
        </div>
      )}
    </div>
  );
}