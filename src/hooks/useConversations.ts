import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getConversations, 
  createConversation, 
  updateConversation, 
  deleteConversation,
  getMessages,
  createMessage,
  type Conversation,
  type Message
} from '../lib/supabase-tables';

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getConversations(user.id);
      setConversations(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const addConversation = async (title?: string) => {
    if (!user) return null;
    
    try {
      const newConversation = await createConversation(user.id, title);
      // Check if conversation already exists to avoid duplicates
      setConversations((prev) => {
        const exists = prev.some(conv => conv.id === newConversation.id);
        if (exists) return prev;
        return [newConversation, ...prev];
      });
      return newConversation;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating conversation:', err);
      throw err;
    }
  };

  const updateConversationTitle = async (id: string, title: string) => {
    try {
      const updated = await updateConversation(id, { title });
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? updated : conv))
      );
    } catch (err) {
      setError(err as Error);
      console.error('Error updating conversation:', err);
      throw err;
    }
  };

  const removeConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting conversation:', err);
      throw err;
    }
  };

  return {
    conversations,
    loading,
    error,
    addConversation,
    updateConversationTitle,
    removeConversation,
    refreshConversations: loadConversations,
  };
};

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [conversationId]);

  const loadMessages = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (content: string, sender: 'user' | 'assistant') => {
    if (!conversationId) return null;
    
    try {
      const newMessage = await createMessage(conversationId, content, sender);
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating message:', err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    addMessage,
    refreshMessages: loadMessages,
  };
};
