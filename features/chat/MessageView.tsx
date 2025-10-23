import React, { useRef, useEffect, useState } from 'react';
import { Conversation } from '../../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useMarketplace } from '../../context/MarketplaceContext';
import Icon from '../../components/Icon';
import { useView } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';

interface MessageViewProps {
  conversation?: Conversation;
}

const MessageView: React.FC<MessageViewProps> = ({ conversation }) => {
    // FIX: `getUserById` is sourced from useMarketplace, not useAuth.
    const { getAdById, getUserById } = useMarketplace();
    const { setView } = useView();
    const { user, blockUser, unblockUser, isUserBlocked } = useAuth();
    const { typingStatus, deleteConversation } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation?.messages, typingStatus]);

    if (!conversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-4">
                <Icon name="chat-bubble-left-right" className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                <p className="mt-4">Select a conversation to start messaging.</p>
            </div>
        );
    }
    
    const otherParticipantId = conversation.participants.find(p => p !== user?.id);
    const otherUser = otherParticipantId ? getUserById(otherParticipantId) : null;
    const ad = getAdById(conversation.adId);
    const isOtherUserBlocked = otherParticipantId ? isUserBlocked(otherParticipantId) : false;

    const handleToggleBlock = () => {
        if (!otherParticipantId) return;
        isOtherUserBlocked ? unblockUser(otherParticipantId) : blockUser(otherParticipantId);
        setIsMenuOpen(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
            deleteConversation(conversation.id);
            // After deletion, view should be reset
            setView({ type: 'chat' });
        }
        setIsMenuOpen(false);
    }

  return (
    <div className="flex-1 flex flex-col">
      <header className="p-4 border-b dark:border-gray-600 flex items-center justify-between shrink-0">
        {otherUser && (
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img src={otherUser.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser.name}`} alt={otherUser.name} className="w-10 h-10 rounded-full" />
                    {otherUser.isOnline && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{otherUser.name}</h3>
                    {ad && <p onClick={() => setView({type: 'ad', id: ad.id})} className="text-xs text-gray-500 hover:underline cursor-pointer">Re: {ad.title}</p>}
                </div>
            </div>
        )}
        <div className="relative">
            <button onClick={() => setIsMenuOpen(p => !p)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Icon name="ellipsis-vertical" className="w-5 h-5" />
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                    <button onClick={handleToggleBlock} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">{isOtherUserBlocked ? 'Unblock User' : 'Block User'}</button>
                    <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600">Delete Conversation</button>
                </div>
            )}
        </div>
      </header>
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {conversation.messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {typingStatus[conversation.id] && (
              <div className="flex items-end gap-2 justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                     <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
              </div>
          )}
           <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput conversationId={conversation.id} isBlocked={isOtherUserBlocked}/>
    </div>
  );
};

export default MessageView;
