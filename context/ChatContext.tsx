import React, { createContext, useState, ReactNode, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/usePersistentState';
import { ChatContextType, Conversation, Message } from '../types';
import { useAuth } from '../hooks/useAuth';

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper to convert file to base64 for embedding in messages
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });


export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('chatConversations', []);
  const { user } = useAuth();
  // FIX: Implement state and refs for typing indicators
  const [typingStatus, setTypingStatus] = useState<{ [conversationId: string]: string | undefined }>({});
  const typingTimeouts = useRef<{ [key: string]: number }>({});

  const getConversationById = useCallback((id: string) => {
    return conversations.find(c => c.id === id);
  }, [conversations]);

  const getConversationsForUser = useCallback((userId: string) => {
    return conversations
      .filter(c => c.participants.includes(userId))
      .sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  }, [conversations]);

  const startOrGetConversation = useCallback((adId: string, recipientId: string): string => {
    if (!user || user.id === recipientId) {
      return '';
    }
    
    const existingConversation = conversations.find(c => 
      c.adId === adId && 
      c.participants.includes(user.id) && 
      c.participants.includes(recipientId)
    );

    if (existingConversation) {
      return existingConversation.id;
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [user.id, recipientId],
      adId,
      messages: [],
      unreadCount: 0,
      // FIX: Add missing 'type' property
      type: 'private',
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  }, [user, conversations, setConversations]);
  
  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user.id,
      content,
      type: 'text',
      timestamp: Date.now(),
      status: 'sent',
    };

    setConversations(prev => {
        const updatedConversations = prev.map(c => {
            if (c.id === conversationId) {
                const newMessages = [...c.messages, newMessage];
                return { ...c, messages: newMessages, lastMessage: newMessage };
            }
            return c;
        });

        const targetConversation = updatedConversations.find(c => c.id === conversationId);
        if (targetConversation) {
            const recipientId = targetConversation.participants.find(p => p !== user.id);
            if (recipientId) {
                setTimeout(() => {
                    const replyMessage: Message = {
                        id: `msg-${Date.now() + 1}`,
                        conversationId,
                        senderId: recipientId,
                        content: `Thanks for your message! I'll get back to you shortly. (Auto-reply)`,
                        type: 'text',
                        timestamp: Date.now(),
                        status: 'delivered',
                    };
                    setConversations(current => current.map(c => {
                        if (c.id === conversationId) {
                            return { ...c, messages: [...c.messages, replyMessage], lastMessage: replyMessage };
                        }
                        return c;
                    }));
                }, 1500);
            }
        }
        return updatedConversations;
    });

  }, [user, setConversations]);

  // FIX: Implement sendMediaMessage
  const sendMediaMessage = useCallback(async (conversationId: string, file: File, type: 'image' | 'file' | 'voice', extraMetadata?: { duration?: number }) => {
    if (!user) return;

    const content = await fileToBase64(file);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user.id,
      content,
      type,
      timestamp: Date.now(),
      status: 'sent',
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        ...extraMetadata,
      },
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const newMessages = [...c.messages, newMessage];
          return { ...c, messages: newMessages, lastMessage: newMessage };
        }
        return c;
      })
    );
  }, [user, setConversations]);
  
  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ));
  }, [setConversations]);
  
  // FIX: Implement deleteConversation
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
  }, [setConversations]);

  // FIX: Implement setTyping
  const setTyping = useCallback((conversationId: string) => {
    if (!user) return;
    
    if (typingTimeouts.current[conversationId]) {
      clearTimeout(typingTimeouts.current[conversationId]);
    }
    
    setTypingStatus(prev => ({ ...prev, [conversationId]: user.name }));
    
    typingTimeouts.current[conversationId] = window.setTimeout(() => {
      setTypingStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[conversationId];
        return newStatus;
      });
    }, 3000);
  }, [user]);

  // FIX: Implement createOrGetAuctionGroupChat to satisfy ChatContextType
  const createOrGetAuctionGroupChat = useCallback((adId: string, sellerId: string, adTitle: string): string => {
    if (!user) return '';

    const existingGroup = conversations.find(c => c.adId === adId && c.type === 'group');
    if (existingGroup) {
      return existingGroup.id;
    }

    const newGroup: Conversation = {
      id: `group-${adId}`,
      participants: [sellerId],
      adId,
      messages: [],
      unreadCount: 0,
      type: 'group',
      name: `Auction: ${adTitle}`,
    };

    setConversations(prev => [...prev, newGroup]);
    return newGroup.id;
  }, [user, conversations, setConversations]);

  // FIX: Implement reactToMessage to satisfy ChatContextType
  const reactToMessage = useCallback((conversationId: string, messageId: string, emoji: string) => {
    if (!user) return;
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id === messageId) {
                const reactions = { ...(m.reactions || {}) };
                if (reactions[emoji] && reactions[emoji].includes(user.id)) {
                  reactions[emoji] = reactions[emoji].filter(id => id !== user.id);
                  if (reactions[emoji].length === 0) {
                    delete reactions[emoji];
                  }
                } else {
                  reactions[emoji] = [...(reactions[emoji] || []), user.id];
                }
                return { ...m, reactions };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );
  }, [user, setConversations]);

  const value: ChatContextType = {
    conversations,
    getConversationById,
    getConversationsForUser,
    startOrGetConversation,
    sendMessage,
    markAsRead,
    // FIX: Add missing properties to context value
    sendMediaMessage,
    deleteConversation,
    typingStatus,
    setTyping,
    createOrGetAuctionGroupChat,
    reactToMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};