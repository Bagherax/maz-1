import React, { useState, useEffect, useRef } from 'react';
import { Ad } from '../../../../types';
import { GoogleGenAI } from '@google/genai';
import Icon from '../../../../components/Icon';
import CloseButton from '../../../../components/CloseButton';
import LoadingSpinner from '../../../../components/LoadingSpinner';

interface MazAssistantProps {
  ad: Ad;
  onClose: () => void;
}

type Message = {
  sender: 'user' | 'assistant';
  text: string;
};

const MazAssistant: React.FC<MazAssistantProps> = ({ ad, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'assistant', text: `Hello! I'm MAZ Assistant. How can I help you with the "${ad.title}"?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const prompt = `You are MAZ Assistant, a helpful AI guide for the MAZDADY marketplace. A user is currently viewing an ad and has a question.
      
      Ad Details:
      - Title: ${ad.title}
      - Description: ${ad.description}
      - Price: ${ad.price} ${ad.currency}
      - Category: ${ad.category}
      - Condition: ${ad.condition}
      - Location: ${ad.location.city}, ${ad.location.country}
      - Seller: ${ad.seller.name}
      
      User's question: "${userMessage.text}"
      
      Please answer the user's question concisely and helpfully based ONLY on the provided ad details. Be friendly and conversational. If the information is not in the details, say that you don't have that information.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const assistantResponse = response.text;
      
      const assistantMessage: Message = { sender: 'assistant', text: assistantResponse };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      const errorMessage: Message = { sender: 'assistant', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div
        className="max-w-md w-full mx-auto bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden animate-slide-down-fast"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col h-[500px]">
          <div className="px-4 py-3 border-b dark:border-zinc-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                MAZ Assistant
              </h2>
              <div className="flex items-center gap-2">
                 <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Online
                 </div>
                 <CloseButton onClick={onClose} className="text-[5px]" />
              </div>
            </div>
          </div>
          <div
            className="flex-1 p-3 overflow-y-auto flex flex-col space-y-3"
            ref={chatDisplayRef}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message max-w-[85%] rounded-lg px-3 py-2 text-sm break-words ${
                  msg.sender === 'assistant'
                    ? 'self-start bg-gray-200 text-zinc-800 dark:bg-zinc-700 dark:text-white rounded-bl-none'
                    : 'self-end bg-blue-500 text-white rounded-br-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
                <div className="self-start bg-gray-200 dark:bg-zinc-700 rounded-lg rounded-bl-none px-3 py-2">
                    {/* Use the small spinner for a more compact "thinking" indicator */}
                    <LoadingSpinner size="sm" />
                </div>
            )}
          </div>
          <div className="px-3 py-2 border-t dark:border-zinc-700">
            <div className="flex gap-2">
              <input
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                id="chatInput"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm disabled:opacity-50"
                id="sendButton"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazAssistant;