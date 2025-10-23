import React, { useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import { Notification, NotificationType } from '../types';
import Icon from './Icon';

const notificationIcons: Record<NotificationType, React.ComponentProps<typeof Icon>['name']> = {
  info: 'bell',
  success: 'check-badge',
  warning: 'shield-exclamation',
  error: 'shield-exclamation',
};

const notificationColors: Record<NotificationType, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const Toast: React.FC<{ notification: Notification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`relative flex items-center p-4 pr-12 text-white rounded-lg shadow-lg overflow-hidden ${notificationColors[notification.type]} animate-slide-down-fast`}>
      <div className="flex-shrink-0">
        <Icon name={notificationIcons[notification.type]} className="w-6 h-6" />
      </div>
      <div className="ml-3 text-sm font-medium">
        {notification.message}
      </div>
      <button onClick={onDismiss} className="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded-full hover:bg-white/20">
        <Icon name="close" className="w-5 h-5" />
      </button>
       <div className="absolute bottom-0 left-0 h-1 bg-white/50 animate-shine"></div>
    </div>
  );
};

const NotificationManager: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-3 w-full max-w-sm">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;