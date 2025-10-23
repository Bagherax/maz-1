import React from 'react';
import { Conversation } from '../../types';
import ConversationListItem from './ConversationListItem';
import { useLocalization } from '../../hooks/useLocalization';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, activeConversationId }) => {
  const { t } = useLocalization();

  return (
    <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
      <header className="p-4 border-b dark:border-gray-600">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('bottom_nav.messages')}</h2>
      </header>
      <div className="flex-grow overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map(conv => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No conversations yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
