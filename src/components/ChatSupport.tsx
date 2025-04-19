import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}

export function ChatSupport() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([])
  console.log("🚀 ~ ChatSupport ~ messages:", messages)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const [showOptions, setOptions] = useState(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  useEffect(() => {
    const channel = supabase
      .channel(`messages${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        console.log('📩 New message:', payload.new);
        setMessages(prevMessages => [...prevMessages, payload.new]); 
      })
      .subscribe();

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching messages:', error);
        setOptions(true);
      } else {
        setMessages(data || []); 
      }
    };

    fetchMessages();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); 

  const handleSendMessage = async (e: React.FormEvent, message: string | undefined) => {
    e.preventDefault?.()
    console.log("🚀 ~ handleSendMessage ~ message:", message)
    if (message.trim() === '') return;

    const {data, error } = await supabase
    .from('messages')
    .insert({
       user_email: user?.email,  
       user_id: user?.id,  
       message: message,  
       admin_id: null,  
       sender: 'user'
      })

      if(error){
        alert("error", error)
        return
      }
    console.log("data", data);
    console.log('messages', message);
    setMessage(''); 
  };

  const chatSuggestions = [
    { id: 1, message: "Can you tell me more about your services?" },
    { id: 2, message: "What are your pricing options?" },
    { id: 3, message: "How do I get started with the tax exemption process?" },
    { id: 4, message: "Can I schedule a free consultation?" },
    { id: 5, message: "What documents do I need to prepare?" },
    { id: 7, message: "How long does the process usually take?" },
    { id: 8, message: "What vehicles are eligible for tax exemption?" },
    { id: 9, message: "Do you handle everything, or do I need to visit any offices?" },
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 bg-primary-600 text-white rounded-full p-3 md:p-4 shadow-lg hover:bg-primary-700 transition-colors touch-manipulation" aria-label="Open chat support"><MessageCircle className="h-6 w-6" /></button>

      {isOpen && (
        <div  ref={chatContainerRef} className="fixed inset-0 md:inset-auto md:bottom-20 md:right-4 md:w-96 bg-white shadow-xl flex flex-col md:rounded-lg z-50 h-96 overflow-auto"
          style={{ maxHeight: '100dvh' }} >

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
            <h3 className="text-lg font-semibold">{t('chat.title')}</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation z-50" aria-label="Close chat" style={{position: 'relative', right: 0, background: 'transparent' }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-4">
            {messages.map((msg) => (
              console.log("msg", msg),
              
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`} >
                <div className={`md:max-w-[85%] rounded-lg p-3 break-words ${msg.sender === 'user'? 'bg-primary-600 text-white': 'bg-gray-100 text-gray-700'}`}>
                  <p className="text-[15px] leading-relaxed">{msg.message}</p>
                  <span className="text-xs opacity-75 mt-1 block">{new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showOptions && (
          <div className="flex flex-wrap bg-white justify-center items-center gap-2 m-5">
            {chatSuggestions.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleSendMessage(e, item.message)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-xl transition w-full"
              >
                {item.message}
              </button>
            ))}
          </div>
          )}

          <form onSubmit={(e)=> handleSendMessage(e, message)}  className="p-4 border-t bg-white sticky bottom-0">
            <div className="flex space-x-2">
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('chat.placeholder')} className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base" style={{ fontSize: '16px',  WebkitAppearance: 'none'}}/>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors touch-manipulation"aria-label="Send message">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>

        </div>
      )}
    </>
  );
}