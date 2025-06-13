'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export function Chatbot() {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // Add user message to chat
      const userMessage: ChatMessage = { 
        type: 'user', 
        text: message,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      const response = await fetch('https://vkjr.app.n8n.cloud/webhook/d2ef0176-568f-4f86-8e48-e5cdbc2c07aa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse and add bot response
      const data = await response.json();
      const botMessage: ChatMessage = { 
        type: 'bot', 
        text: data.solution,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform transition-all duration-300 ${
            !isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}
        >
          <span className="text-xl animate-bounce">💬</span>
        </Button>        <div
          className={`absolute bottom-0 right-0 transition-all duration-300 transform origin-bottom-right ${
            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <Card className="w-96 shadow-2xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <h3 className="font-bold text-lg">ZTRIKE AI</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-blue-700 rounded"
              >
                ✕
              </button>
            </div>
              <div className="flex flex-col h-[450px] bg-gradient-to-b from-gray-50 to-white">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeSlide`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 shadow-md transform transition-all duration-300 ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-100 hover:scale-[1.02]'
                          : 'bg-white text-gray-900 scale-100 hover:scale-[1.02]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {msg.text.split('**').map((part, i) => (
                          i % 2 === 0 ? (
                            <span key={i}>{part}</span>
                          ) : (
                            <strong key={i} className="font-bold">{part}</strong>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-fadeSlide">
                    <div className="bg-white text-gray-900 rounded-lg px-4 py-2 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/70 backdrop-blur-sm focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105"
                  >
                    Send
                  </Button>
                </form>
              </div>
            </div>          </Card>
        </div>
      </div>
    </div>
  );
}
