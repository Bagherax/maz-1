import React from 'react';
import { Conversation } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useView } from '../../App';

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, isActive }) => {
  const { user: currentUser } = useAuth();
  const { getAdById, getUserById } = useMarketplace();
  const { setView } = useView();

  const otherParticipantId = conversation.participants.find(p => p !== currentUser?.id);
  const otherUser = otherParticipantId ? getUserById(otherParticipantId) : null;
  const ad = getAdById(conversation.adId);

  if (!otherUser || !ad) {
    return null; // Don't render if data is incomplete
  }

  const handleClick = () => {
    setView({ type: 'chat', conversationId: conversation.id });
  };
  
  const lastMessage = conversation.lastMessage;

  return (
    <div
      onClick={handleClick}
      className={`p-4 flex items-center space-x-3 rtl:space-x-reverse cursor-pointer transition-colors border-b dark:border-gray-700/50 ${
        isActive ? 'bg-indigo-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className="relative flex-shrink-0">
        <img
            className="h-12 w-12 rounded-full object-cover"
            src={otherUser.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser.name}`}
            alt={otherUser.name}
        />
        {otherUser.isOnline && (
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{otherUser.name}</p>
          {lastMessage && (
            <p className="text-xs text-gray-400">
              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {lastMessage?.content || `Re: ${ad.title}`}
            </p>
            {conversation.unreadCount > 0 && (
                <span className="flex-shrink-0 ms-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;