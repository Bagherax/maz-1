import React from 'react';
import { Message } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icon';
import { useLocalization } from '../../hooks/useLocalization';

interface MessageBubbleProps {
  message: Message;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const isSentByCurrentUser = message.senderId === user?.id;

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return <img src={message.content} alt={message.metadata?.fileName || 'Image'} className="max-w-xs rounded-lg cursor-pointer" onClick={() => window.open(message.content, '_blank')} />;
      case 'voice':
        return (
          <div className="flex items-center gap-2 w-56 sm:w-64">
            <audio controls src={message.content} className="w-full h-10" />
            {message.metadata?.duration != null && <span className="text-xs font-mono">{formatDuration(message.metadata.duration)}</span>}
          </div>
        );
      case 'file':
        return (
            <a href={message.content} download={message.metadata?.fileName} className="flex items-center gap-3 p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20">
                <Icon name="file-earmark-arrow-down" className="w-8 h-8 flex-shrink-0" />
                <div className="min-w-0">
                    <p className="truncate font-semibold">{message.metadata?.fileName}</p>
                    {message.metadata?.fileSize && <p className="text-xs">{formatBytes(message.metadata.fileSize)}</p>}
                </div>
            </a>
        );
      case 'text':
      default:
        return <p className="text-sm break-words">{message.content}</p>;
    }
  };

  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg rounded-2xl ${
    isSentByCurrentUser
      ? 'bg-indigo-600 text-white rounded-br-none'
      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
  }`;

  return (
    <div className={`flex items-end gap-2 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${bubbleClasses} ${message.type === 'text' ? 'px-4 py-2' : 'p-2'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageBubble;