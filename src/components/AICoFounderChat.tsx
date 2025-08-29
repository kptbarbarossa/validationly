import React, { useState, useEffect, useRef } from 'react';
import { aiCoFounderService } from '../services/aiCoFounderService';
import type { AICoFounderResponse, AISuggestion } from '../types/aiCoFounder';

interface AICoFounderChatProps {
  userId: string;
  currentIdea?: string;
  className?: string;
}

const AICoFounderChat: React.FC<AICoFounderChatProps> = ({ 
  userId, 
  currentIdea, 
  className = '' 
}) => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    suggestions?: AISuggestion[];
    followUpQuestions?: string[];
    nextSteps?: string[];
  }>>([]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      handleInitialMessage();
    }
  }, []);

  const handleInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await aiCoFounderService.processMessage(
        userId, 
        "Merhaba! Size nasil yardimci olabilirim?", 
        currentIdea
      );
      
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions,
        nextSteps: response.nextSteps
      }]);
    } catch (error) {
      console.error('Error getting initial message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiCoFounderService.processMessage(
        userId, 
        inputMessage, 
        currentIdea
      );

      const aiMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai' as const,
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions,
        nextSteps: response.nextSteps
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'ai' as const,
        content: 'Uzgunum, bir hata olustu. Lutfen tekrar deneyin.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setInputMessage(question);
    // Small delay to ensure input is set
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleSuggestionClick = async (suggestion: AISuggestion) => {
    const message = `"${suggestion.title}" hakkında daha fazla bilgi almak istiyorum. ${suggestion.description}`;
    setInputMessage(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className={`bg-gray-800/50 rounded-xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🤖</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Co-founder</h3>
            <p className="text-sm text-gray-400">Your personalized business advisor</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'} rounded-lg p-3`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1]?.followUpQuestions?.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {messages.length > 0 && messages[messages.length - 1]?.suggestions && (
            <div className="p-4 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">AI Suggestions:</p>
              <div className="space-y-2">
                {messages[messages.length - 1].suggestions?.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">{suggestion.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{suggestion.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-blue-400">{suggestion.confidence}%</div>
                        <div className="text-xs text-gray-500">{suggestion.type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="AI Co-founder'a sorun..."
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Gönder
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AICoFounderChat;
