import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import ConversationList from './ConversationList';
import MessageView from './MessageView';

interface ChatPageProps {
  conversationId?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const { getConversationsForUser, getConversationById } = useChat();

  if (!user) {
    return <div>Please log in to view messages.</div>;
  }

  const conversations = getConversationsForUser(user.id);
  const activeConversation = conversationId ? getConversationById(conversationId) : undefined;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-140px)]">
      <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <ConversationList conversations={conversations} activeConversationId={conversationId} />
        <MessageView conversation={activeConversation} />
      </div>
    </div>
  );
};

export default ChatPage;
