import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can we help you today?',
      sender: 'support',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      text: 'Our support team is here to assist you with any questions about vehicle tax exemption.',
      sender: 'support',
      timestamp: new Date().toISOString()
    }
  ]);

  const { files } = useFiles();
  const previousFilesRef = useRef<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentFileIds = files.map(f => f.id);
    const previousFileIds = previousFilesRef.current;

    // Check for new files
    const newFiles = files.filter(f => !previousFileIds.includes(f.id));
    if (newFiles.length > 0) {
      newFiles.forEach(newFile => {
        const supportMessage: Message = {
          id: crypto.randomUUID(),
          text: `I see you've uploaded "${newFile.name}". Our team will review this document shortly. Is there anything specific you'd like to know about it?`,
          sender: 'support',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, supportMessage]);
      });
    }

    // Check for deleted files
    const deletedFiles = previousFileIds.filter(id => !currentFileIds.includes(id));
    if (deletedFiles.length > 0) {
      const supportMessage: Message = {
        id: crypto.randomUUID(),
        text: "I notice you've removed some files. Let me know if you need help with uploading new documents.",
        sender: 'support',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, supportMessage]);
    }

    previousFilesRef.current = currentFileIds;
  }, [files]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle mobile keyboard appearance
  useEffect(() => {
    if (isOpen) {
      const resizeHandler = () => {
        if (chatContainerRef.current) {
          const vh = window.innerHeight * 0.01;
          chatContainerRef.current.style.height = `${vh * 100}px`;
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      };
      
      window.addEventListener('resize', resizeHandler);
      return () => window.removeEventListener('resize', resizeHandler);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("User is not authenticated.");
      return; 
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

      // Insert user message into Supabase
      const { error } = await supabase.from('chats')
      .insert([{
        user_id: user.id,
        message: message,  
        sender: 'user', 
        timestamp: new Date().toISOString()
    }]);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setMessages((prev) => [...prev, userMessage]);
      }
    setMessage('');

    setTimeout(() => {
      const supportMessage: Message = {
        id: crypto.randomUUID(),
        text: 'Thank you for your message. Our team will review your request and get back to you shortly.',
        sender: 'support',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 md:p-4 shadow-lg hover:bg-blue-700 transition-colors touch-manipulation"
        aria-label="Open chat support"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div 
          ref={chatContainerRef}
          className="fixed inset-0 md:inset-auto md:bottom-20 md:right-4 md:w-96 bg-white shadow-xl flex flex-col md:rounded-lg z-50"
          style={{ maxHeight: '100dvh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
            <h3 className="text-lg font-semibold">Chat Support</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation z-50"
              aria-label="Close chat"
              style={{
                position: 'relative',
                right: 0,
                background: 'transparent'
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 break-words ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t bg-white sticky bottom-0"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                style={{
                  fontSize: '16px', // Prevents iOS zoom on focus
                  WebkitAppearance: 'none' // Removes iOS styling
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}