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

export function DashboardChatGPT() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user, isInitialized } = useAuthStore();
  const { t } = useTranslation();
  
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  // Add chat message event listener
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
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('chat-message', handleChatMessage as EventListener);
    return () => window.removeEventListener('chat-message', handleChatMessage as EventListener);
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
          toast.error(t('Please sign in to access the dashboard'));
          return;
        }

        if (session.user.id !== userId) {
          navigate('/');
          toast.error(t('Unauthorized access'));
          return;
        }

        setAuthChecked(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/');
        toast.error(t('Authentication error. Please try again.'));
      }
    };

    checkAuth();
  }, [isInitialized, userId, navigate, t]);

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
      toast.error(t('Failed to get response. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const simulateGPTResponse = async (userMessage: string) => {
    const responses = [
      t("I understand your question. Let me analyze that for you..."),
      t("Based on the data provided, here's what I can tell you..."),
      t("That's an interesting point. Here's my analysis..."),
      t("I've processed your request. Here's what I found...")
    ];
    
    return new Promise<string>(resolve => {
      setTimeout(() => {
        resolve(responses[Math.floor(Math.random() * responses.length)] + " [Simulated Response]");
      }, 1500);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!user?.id) {
      toast.error(t('Please sign in to upload files'));
      return;
    }

    const upload: FileUpload = {
      id: Date.now().toString(),
      name: file.name,
      status: 'uploading',
      progress: 0
    };

    setUploads(prev => [...prev, upload]);

    try {
      const url = await uploadVehicleFile(file, user.id);
      if (url) {
        setUploads(prev => 
          prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'complete', progress: 100 }
              : u
          )
        );
        toast.success(t('File uploaded successfully'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploads(prev => 
        prev.map(u => 
          u.id === upload.id 
            ? { ...u, status: 'error', progress: 0 }
            : u
        )
      );
      toast.error(t('Failed to upload file'));
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {/* Download Guide */}
        <MaterialCard elevation={2} className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('Download Guide')}</h2>
          <DownloadGuide 
            onSuccess={() => toast.success(t('Guide downloaded successfully'))}
            onError={(error) => toast.error(error.message)}
          />
        </MaterialCard>

        {/* Upload Vehicle Data */}
        <MaterialCard elevation={2} className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('Upload Vehicle Data')}</h2>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {t('Upload Files')}
          </Button>
          {uploads.map(upload => (
            <div key={upload.id} className="mt-4">
              <p className="text-sm text-gray-600 truncate">{upload.name}</p>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    upload.status === 'complete' ? 'bg-green-500' :
                    upload.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  )}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            </div>
          ))}
        </MaterialCard>

        {/* Chat Interface */}
        <MaterialCard elevation={2} className="bg-white rounded-lg overflow-hidden">
          <div className="flex flex-col h-[500px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">{t('Chat Assistant')}</h2>
              {isMobile && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setChatVisible(false)}
                  className="p-1"
                  aria-label={t('Chat schließen')}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3",
                    message.role === 'assistant' ? 'bg-blue-50' : ''
                  )}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  ) : (
                    <User className="w-6 h-6 text-gray-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 break-words">{message.content}</p>
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
              className="border-t p-3 bg-white"
            >
              <div className="flex items-center gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('Type your message...')}
                  className="flex-1 min-h-[44px] max-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  variant="primary"
                  size="sm"
                  className="h-[44px] w-[44px] p-0 rounded-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </MaterialCard>
      </div>
    </div>
  );
}