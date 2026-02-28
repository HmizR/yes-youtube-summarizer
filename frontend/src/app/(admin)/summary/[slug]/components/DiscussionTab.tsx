"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Settings,
  Cpu,
  Zap,
  Clock,
  ChevronDown,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronRight,
  X
} from 'lucide-react';
import { marked } from 'marked';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  user?: {
    id: string;
    username: string;
    avatar: string;
  };
  created_at: string;
  model_used?: string;
  metadata?: any;
}

interface OllamaModel {
  name: string;
  size?: number;
  digest?: string;
  modified_at?: string;
}

interface SuggestedQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL + '/api/v1') || 'http://192.168.1.30:5000/api/v1'; // process.env.NEXT_PUBLIC_API_URL || 

const DiscussionTab = ({ summaryId, summaryTitle }: { summaryId: string; summaryTitle: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama2');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAuthToken = (): string => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token || '';
    }
    return '';
  };

  const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Ignore
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeDiscussion = async () => {
      setIsInitializing(true);
      setError(null);
      
      try {
        try {
          const modelsData = await apiCall('/ollama/models');
          console.log('Fetched models:', modelsData);
          if (modelsData.success && modelsData.data) {
            setAvailableModels(modelsData.data);
            if (modelsData.data.length > 0 && !modelsData.data.find((m: OllamaModel) => m.name === selectedModel)) {
              setSelectedModel(modelsData.data[0].name);
            }
          }
        } catch (modelError) {
          console.warn('Could not fetch models:', modelError);
        }

        try {
          const discussionsData = await apiCall(`/summaries/${summaryId}/discussions`);
          
          if (discussionsData.success && discussionsData.data && discussionsData.data.length > 0) {
            const thread = discussionsData.data[0];
            setThreadId(thread.id);
            if (thread.model_used) {
              setSelectedModel(thread.model_used);
            }
            await fetchMessages(thread.id);
          } else {
            await createDiscussionThread();
          }
        } catch (discussionError) {
          console.error('Error checking discussions:', discussionError);
          await createDiscussionThread();
        }

        await fetchSuggestedQuestions();
        
      } catch (error) {
        console.error('Error initializing discussion:', error);
        setError('Failed to initialize discussion. Please check your connection and try again.');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeDiscussion();
  }, [summaryId]);

  const createDiscussionThread = async () => {
    try {
      const response = await apiCall(`/summaries/${summaryId}/discussions/start`, {
        method: 'POST',
        body: JSON.stringify({ model: selectedModel })
      });
      
      if (response.success && response.data) {
        setThreadId(response.data.id);
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Hello! I'm here to help you discuss "${summaryTitle}". Ask me anything about this video!`,
          created_at: new Date().toISOString(),
          model_used: selectedModel
        };
        setMessages([welcomeMessage]);
      } else {
        throw new Error(response.error || 'Failed to create discussion');
      }
    } catch (error) {
      console.error('Error creating discussion thread:', error);
      setError('Could not start a new discussion. Please try again.');
      const offlineMessage: Message = {
        id: 'offline-welcome',
        role: 'assistant',
        content: `I'm here to help you discuss "${summaryTitle}". Note: Running in offline mode.`,
        created_at: new Date().toISOString(),
      };
      setMessages([offlineMessage]);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const result = await apiCall(`/discussions/${threadId}/messages`);
      
      if (result.success && result.data) {
        setMessages(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const fetchSuggestedQuestions = async () => {
    try {
      const result = await apiCall(`/summaries/${summaryId}/suggested-questions`);
      
      if (result.success && result.data) {
        setSuggestedQuestions(result.data);
      }
    } catch (error) {
      console.error('Error fetching suggested questions:', error);
      setSuggestedQuestions([
        { id: '1', question: 'What are the main takeaways?', category: 'summary', difficulty: 'easy' },
        { id: '2', question: 'Explain key concepts simply', category: 'explanation', difficulty: 'medium' },
        { id: '3', question: 'Most important points?', category: 'key_points', difficulty: 'easy' },
        { id: '4', question: 'How to apply this knowledge?', category: 'application', difficulty: 'hard' },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!threadId) {
      setError('No active discussion thread. Please refresh the page.');
      return;
    }
    if (isLoading) return;

    const userMessageContent = input.trim();
    setInput('');
    
    const tempUserMessage: Message = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: userMessageContent,
      user: {
        id: 'current-user',
        username: 'You',
        avatar: ''
      },
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall(`/discussions/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ 
          content: userMessageContent,
          model: selectedModel 
        })
      });

      if (response.success && response.data) {
        setMessages(prev => [
          ...prev.filter(m => !m.id.startsWith('temp-')),
          response.data.userMessage,
          response.data.aiMessage
        ]);
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
        model_used: selectedModel
      };
      setMessages(prev => [...prev, errorMessage]);
      
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Now';
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getModelDisplayName = (modelName: string) => {
    const modelMap: Record<string, string> = {
      'llama2': 'Llama 2',
      'llama2:13b': 'Llama 2 (13B)',
      'llama2:70b': 'Llama 2 (70B)',
      'mistral': 'Mistral',
      'mixtral': 'Mixtral',
      'codellama': 'Code Llama',
      'phi': 'Phi-2',
      'gemma': 'Gemma',
      'llama3': 'Llama 3',
      'llama3.1': 'Llama 3.1',
    };
    return modelMap[modelName] || modelName.replace(/[:/]/g, ' ');
  };

  // Auto-hide suggestions when messages grow
  useEffect(() => {
    if (messages.length >= 3) {
      setShowSuggestions(false);
    }
  }, [messages.length]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Initializing Discussion
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Loading AI models and setting up your discussion about "{summaryTitle}"
        </p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Discussion Error
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          {error}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={createDiscussionThread}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                AI Discussion
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                {summaryTitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Toggle Suggestions Button - Only show when there are questions */}
            {suggestedQuestions.length > 0 && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title={showSuggestions ? "Hide suggestions" : "Show suggestions"}
              >
                <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                <span className="hidden sm:inline dark:text-white">
                  {showSuggestions ? 'Hide' : 'Show'} Questions
                </span>
                {showSuggestions ? (
                  <ChevronUp className="h-3.5 w-3.5 ml-1 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 ml-1 dark:text-gray-400" />
                )}
              </button>
            )}
            
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Cpu className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium dark:text-white">
                  {getModelDisplayName(selectedModel)}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {showModelDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowModelDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        AI Models
                      </div>
                      {availableModels.length > 0 ? (
                        availableModels.map((model) => (
                          <button
                            key={model.name}
                            onClick={() => {
                              setSelectedModel(model.name);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              selectedModel === model.name
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Cpu className="h-3 w-3" />
                                <span className="truncate">{getModelDisplayName(model.name)}</span>
                              </div>
                              {model.size && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                  {(model.size / 1024 / 1024 / 1024).toFixed(1)}G
                                </span>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          <Bot className="h-6 w-6 mx-auto mb-2 opacity-50" />
                          <p>No AI models available</p>
                          <p className="text-xs mt-1">Check Ollama installation</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages Area - Takes most space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 h-full flex flex-col justify-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl mb-4">
                <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Start a discussion about this video
              </h4>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Ask questions about the content, get clarifications, or dive deeper into topics.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">AI Assistant</span>
                        {message.model_used && (
                          <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded truncate max-w-[80px]">
                            {getModelDisplayName(message.model_used).split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  )}
                  
                  {message.role === 'user' && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">You</span>
                      <span className="text-xs opacity-80">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  )}
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap break-words text-sm" dangerouslySetInnerHTML={{__html: marked.parse(message.content ?? '')}}></p>
                  </div>
                  
                  {message.role === 'assistant' && !message.id.startsWith('error') && (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Copy response"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Helpful"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Not helpful"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none p-3 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Compact Suggested Questions - Now a horizontal scrollable bar */}
        {suggestedQuestions.length > 0 && showSuggestions && messages.length < 5 && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Quick Questions
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({suggestedQuestions.length})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={fetchSuggestedQuestions}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Refresh suggestions"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''} dark:text-gray-400`} />
                </button>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors dark:text-gray-400"
                  title="Hide suggestions"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleSuggestedQuestion(question.question)}
                    disabled={isLoading}
                    className="flex-shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed group min-w-0 max-w-[200px]"
                  >
                    <div className="flex items-start gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                        {question.question}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full truncate max-w-[80px]">
                        {question.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-500 capitalize">
                        {question.difficulty.charAt(0)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about "${summaryTitle}"...`}
                className="w-full px-3 py-2 pr-9 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={isLoading || !threadId}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="absolute right-2.5 top-2.5">
                <Sparkles className="h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || !threadId}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </form>
          
          {/* Footer Info - Compact */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 truncate">
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                <span className="hidden sm:inline">{getModelDisplayName(selectedModel)}</span>
                <span className="sm:hidden">{getModelDisplayName(selectedModel).split(' ')[0]}</span>
              </span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Context-aware
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs font-mono">
                ⏎
              </kbd>
              <span className="text-xs">to send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionTab;