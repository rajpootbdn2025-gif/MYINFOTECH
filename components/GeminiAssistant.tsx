import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'Namaste! I am your Sandhya Infotech Digital Assistant. How can I help you with your PAN, Aadhaar, or other government service queries today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            {
                role: 'user',
                parts: [
                    { 
                        text: `You are a professional customer support representative for "Sandhya Infotech", a premier digital service center in India. 
                        
                        RULES:
                        1. Provide accurate information about Indian government services (PAN, Aadhaar, Passport, GST, PM-Kisan).
                        2. Be polite and professional. Start with a brief greeting if appropriate.
                        3. Use bullet points for steps or requirements.
                        4. Keep responses concise but helpful.
                        5. If asked about prices, mention that service charges are as per government norms + nominal facilitation fee.
                        
                        Context:
                        - Aadhaar updates take 7-30 days.
                        - New PAN cards take 7-15 days.
                        - GST filing is monthly/quarterly.
                        - We also do travel bookings and bill payments.
                        
                        User Question: ${input}` 
                    }
                ]
            }
        ],
        config: {
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const aiText = response.text || "I apologize, but I am unable to process your request at this moment. Please contact our support team via email for assistance.";

      const aiMessage: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          text: aiText 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          text: "I'm sorry, I'm experiencing some technical difficulties. Please try again later or contact our email support." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-900 text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 transition-all z-50 flex items-center gap-3 group ring-4 ring-white"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-blue-900 animate-pulse"></span>
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap text-sm">
            Chat with AI Support
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[85vh] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col z-[150] overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md ring-1 ring-white/20">
                <Bot size={22} className="text-blue-100" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">Sandhya AI Support</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-xl transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-orange-600 text-white' : 'bg-white text-blue-600 ring-1 ring-gray-100'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div
                  className={`p-4 rounded-3xl text-[13px] max-w-[85%] shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-3">
                 <div className="w-9 h-9 rounded-2xl bg-white text-blue-600 ring-1 ring-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot size={18} />
                 </div>
                 <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-xs text-gray-400 font-bold italic tracking-wide">AI is thinking...</span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="How can I help you today?"
                className="flex-1 bg-transparent border-none outline-none text-sm px-3 text-gray-700 py-1"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-3">
                <Sparkles size={10} className="text-orange-400" />
                <p className="text-[10px] text-gray-400 font-medium">Powered by Gemini AI Technology</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};