import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Send, 
  Upload, 
  Loader2, 
  Bot, 
  User, 
  X, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { DownloadGuide } from './DownloadGuide';

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
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vehicleDataInputRef = useRef<HTMLInputElement>(null);
  const dataSet2InputRef = useRef<HTMLInputElement>(null);

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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function updateStepStatus(stepId: number, status: ProcessStep['status']) {
    setProcessSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }

  function addSystemMessage(content: string) {
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  }

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, stepId: number) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newUploads: FileUpload[] = Array.from(files).map(file => ({
      id: Date.now().toString(),
      name: file.name,
      status: 'uploading',
      progress: 0
    }));

    setUploads(prev => [...prev, ...newUploads]);
    updateStepStatus(stepId, 'active');

    for (const upload of newUploads) {
      try {
        for (let progress = 0; progress <= 100; progress += 20) {
          setUploads(prev => 
            prev.map(u => 
              u.id === upload.id ? { ...u, progress } : u
            )
          );
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        setUploads(prev => 
          prev.map(u => 
            u.id === upload.id ? { ...u, status: 'complete' } : u
          )
        );

        updateStepStatus(stepId, 'complete');
        
        if (stepId < 4) {
          updateStepStatus(stepId + 1, 'active');
        }

        addSystemMessage(`File "${upload.name}" has been successfully uploaded and processed.`);

      } catch (error) {
        console.error('Upload error:', error);
        setUploads(prev => 
          prev.map(u => 
            u.id === upload.id ? { ...u, status: 'error' } : u
          )
        );
        updateStepStatus(stepId, 'error');
        toast.error(`Failed to upload ${upload.name}`);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  };

  const handleGuideDownloadSuccess = () => {
    updateStepStatus(1, 'complete');
    updateStepStatus(2, 'active');
    addSystemMessage('Guide has been downloaded successfully. You can now proceed with uploading your vehicle data.');
  };

  const handleGuideDownloadError = (error: Error) => {
    updateStepStatus(1, 'error');
    addSystemMessage('There was a problem downloading the guide. Please try again or contact support if the issue persists.');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-none bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DownloadGuide 
              onSuccess={handleGuideDownloadSuccess}
              onError={handleGuideDownloadError}
            />

            {processSteps.slice(1).map((step) => (
              <div 
                key={step.id}
                className={`p-4 rounded-lg border ${
                  step.status === 'active' ? 'border-blue-500 bg-blue-50' :
                  step.status === 'complete' ? 'border-green-500 bg-green-50' :
                  step.status === 'error' ? 'border-red-500 bg-red-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className={`w-5 h-5 ${
                    step.status === 'active' ? 'text-blue-500' :
                    step.status === 'complete' ? 'text-green-500' :
                    step.status === 'error' ? 'text-red-500' :
                    'text-gray-400'
                  }`} />
                  <h3 className="font-medium">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                {step.buttonText && step.action && (
                  <Button
                    onClick={step.action}
                    disabled={step.status === 'pending'}
                    size="sm"
                    className="w-full"
                  >
                    {step.buttonText}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto px-4 py-6 w-full">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'assistant' ? 'bg-blue-50' : ''
                } rounded-lg p-3`}
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

          {uploads.length > 0 && (
            <div className="flex-none border-t border-gray-200 p-4 space-y-2 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Uploads</h3>
              <div className="space-y-2">
                {uploads.map(upload => (
                  <div
                    key={upload.id}
                    className="flex items-center gap-2 bg-white p-2 rounded-md"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="flex-1 text-sm truncate">{upload.name}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => removeUpload(upload.id)}
                      className="p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-none border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <input
                ref={vehicleDataInputRef}
                type="file"
                onChange={(e) => handleFileUpload(e, 2)}
                className="hidden"
                multiple
              />
              <input
                ref={dataSet2InputRef}
                type="file"
                onChange={(e) => handleFileUpload(e, 3)}
                className="hidden"
                multiple
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="w-5 h-5" />
              </Button>
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
        </div>
      </div>
    </div>
  );
}