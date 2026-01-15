import { supabase } from './supabase';

// Types
export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  chat_theme: string;
  chat_language: string;
  font_size: number;
  border_radius: number;
  sound_enabled: boolean;
  custom_prompt: string | null;
  response_rules: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  conversation_id: string;
  response_time_ms: number | null;
  satisfaction_score: number | null;
  created_at: string;
}

// Conversation functions
export const createConversation = async (userId: string, title?: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, title: title || 'Nueva conversación' })
    .select()
    .single();
  
  if (error) throw error;
  return data as Conversation;
};

export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data as Conversation[];
};

export const updateConversation = async (id: string, updates: Partial<Conversation>) => {
  const { data, error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Conversation;
};

export const deleteConversation = async (id: string) => {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Message functions
export const createMessage = async (conversationId: string, content: string, sender: 'user' | 'assistant') => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, content, sender })
    .select()
    .single();
  
  if (error) throw error;
  return data as Message;
};

export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as Message[];
};

// User settings functions
export const getUserSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data as UserSettings | null;
};

export const createOrUpdateUserSettings = async (userId: string, settings: Partial<UserSettings>) => {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ user_id: userId, ...settings }, { onConflict: 'user_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data as UserSettings;
};

// Analytics functions
export const createAnalytics = async (analytics: Omit<Analytics, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('analytics')
    .insert(analytics)
    .select()
    .single();
  
  if (error) throw error;
  return data as Analytics;
};

export const getUserAnalytics = async (userId: string) => {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Analytics[];
};
