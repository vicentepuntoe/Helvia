import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useConversations, useMessages } from '../../hooks/useConversations';
import { useAuth } from '../../contexts/AuthContext';
import { getUserSettings } from '../../lib/supabase-tables';
import { translations, type Language } from '../../locales/translations';

type ColorTheme = 'Verde' | 'Azul' | 'Púrpura';

const colorThemes = {
  Verde: { primary: '#16A34A', primaryHover: '#15803D', primarySoft: '#DCFCE7' },
  Azul: { primary: '#2563EB', primaryHover: '#1D4ED8', primarySoft: '#DBEAFE' },
  Púrpura: { primary: '#7C3AED', primaryHover: '#6D28D9', primarySoft: '#EDE9FE' },
};

const ChatSection = () => {
  const { user } = useAuth();
  const { language: appLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const t = translations[appLanguage];
  const { conversations, addConversation, updateConversationTitle, loading: conversationsLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages, addMessage, loading: messagesLoading } = useMessages(selectedConversationId);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('Verde');
  const [fontSize, setFontSize] = useState(14);
  const [borderRadius, setBorderRadius] = useState(16);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const hasCreatedInitialConversation = useRef(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      try {
        const settings = await getUserSettings(user.id);
        if (settings) {
          setColorTheme(settings.chat_theme as ColorTheme);
          setFontSize(settings.font_size);
          setBorderRadius(settings.border_radius);
          setSoundEnabled(settings.sound_enabled);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, [user]);

  // Apply color theme
  useEffect(() => {
    const theme = colorThemes[colorTheme];
    document.documentElement.style.setProperty('--chat-primary', theme.primary);
    document.documentElement.style.setProperty('--chat-primary-hover', theme.primaryHover);
    document.documentElement.style.setProperty('--chat-primary-soft', theme.primarySoft);
  }, [colorTheme]);

  // Create or select conversation (only once)
  useEffect(() => {
    if (conversationsLoading) return; // Wait for loading to complete
    
    // If we have conversations, select the first one
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
      return;
    }
    
    // If no conversations and haven't created one yet, create it
    if (conversations.length === 0 && !selectedConversationId && !hasCreatedInitialConversation.current) {
      hasCreatedInitialConversation.current = true;
      handleNewConversation().catch((error) => {
        console.error('Error creating initial conversation:', error);
        hasCreatedInitialConversation.current = false; // Reset on error so it can retry
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationsLoading, conversations.length, selectedConversationId]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewConversation = async () => {
    if (hasCreatedInitialConversation.current && selectedConversationId) {
      return; // Don't create if we already have one selected
    }
    try {
      const newConv = await addConversation();
      if (newConv) {
        setSelectedConversationId(newConv.id);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      hasCreatedInitialConversation.current = false; // Reset on error so it can retry
    }
  };

  const getInitialMessage = (lang: Language): string => {
    const initialMessages: Record<Language, string> = {
      es: "¡Hola! Soy Helvia, tu asistente de IA. Estoy aquí para ayudarte con cualquier pregunta sobre nuestra plataforma, soporte al cliente o cómo podemos ayudar a tu negocio. ¿Cómo puedo ayudarte hoy?",
      en: "Hello! I'm Helvia, your AI assistant. I'm here to help you with any questions about our platform, customer support, or how we can assist your business. How can I help you today?",
      pt: "Olá! Sou Helvia, sua assistente de IA. Estou aqui para ajudá-lo com qualquer dúvida sobre nossa plataforma, suporte ao cliente ou como podemos ajudar seu negócio. Como posso ajudá-lo hoje?",
      fr: "Bonjour! Je suis Helvia, votre assistante IA. Je suis ici pour vous aider avec toutes vos questions sur notre plateforme, le support client ou comment nous pouvons aider votre entreprise. Comment puis-je vous aider aujourd'hui?",
    };
    return initialMessages[lang];
  };


  const getResponse = (userMessage: string, lang: Language): string => {
    const lowerMessage = userMessage.toLowerCase();
    const responses: Record<Language, Record<string, string>> = {
      es: {
        order: "¡Estaré encantado de ayudarte con tu pedido! ¿Podrías proporcionarme tu número de pedido?",
        price: "Nuestros precios son flexibles y se basan en las necesidades de tu negocio. ¿Te gustaría que te conecte con nuestro equipo de ventas?",
        default: `Gracias por tu mensaje: "${userMessage}". Déjame ayudarte con eso. ¿Podrías proporcionar un poco más de contexto?`,
      },
      en: {
        order: "I'd be happy to help you with your order! Could you please provide me with your order number?",
        price: "Our pricing is flexible and based on your business needs. Would you like me to connect you with our sales team?",
        default: `Thank you for your message: "${userMessage}". Let me help you with that. Could you provide a bit more context?`,
      },
      pt: {
        order: "Ficaria feliz em ajudá-lo com seu pedido! Você poderia me fornecer o número do seu pedido?",
        price: "Nossos preços são flexíveis e baseados nas necessidades do seu negócio. Gostaria que eu o conecte com nossa equipe de vendas?",
        default: `Obrigado pela sua mensagem: "${userMessage}". Deixe-me ajudá-lo com isso. Você poderia fornecer um pouco mais de contexto?`,
      },
      fr: {
        order: "Je serais ravi de vous aider avec votre commande! Pourriez-vous me fournir le numéro de votre commande?",
        price: "Nos tarifs sont flexibles et basés sur les besoins de votre entreprise. Souhaitez-vous que je vous mette en contact avec notre équipe commerciale?",
        default: `Merci pour votre message: "${userMessage}". Laissez-moi vous aider avec cela. Pourriez-vous fournir un peu plus de contexte?`,
      },
    };

    const langResponses = responses[lang];
    if (lowerMessage.includes('order') || lowerMessage.includes('pedido') || lowerMessage.includes('commande')) {
      return langResponses.order;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('precio') || lowerMessage.includes('preço') || lowerMessage.includes('prix')) {
      return langResponses.price;
    }
    return langResponses.default;
  };

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedConversationId) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      await addMessage(userMsg, 'user');
      // Use the app language from context instead of trying to detect from message
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
      const response = getResponse(userMsg, appLanguage);
      await addMessage(response, 'assistant');
      playNotificationSound();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(
      appLanguage === 'es' ? 'es-ES' : appLanguage === 'pt' ? 'pt-BR' : appLanguage === 'fr' ? 'fr-FR' : 'en-US',
      { hour: '2-digit', minute: '2-digit' }
    );
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleStartEditTitle = () => {
    if (selectedConversation) {
      setEditingTitle(selectedConversation.title || t.dashboard.newConversation);
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = async () => {
    if (!selectedConversationId || !editingTitle.trim()) return;
    try {
      await updateConversationTitle(selectedConversationId, editingTitle.trim());
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditingTitle('');
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditTitle();
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Conversations Sidebar */}
        <div className="w-64 bg-card dark:bg-slate-800 rounded-xl border-2 border-border dark:border-slate-700 p-4 flex flex-col">
          <button
            onClick={handleNewConversation}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold mb-4 hover:bg-primary-hover transition-colors"
          >
            + {t.dashboard.newConversation}
          </button>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedConversationId === conv.id
                    ? 'bg-primary-soft dark:bg-primary/20 border border-primary'
                    : 'hover:bg-[#F8FAF9] dark:hover:bg-slate-700'
                }`}
              >
                <p className="font-medium text-sm text-text-primary dark:text-white truncate">
                  {conv.title || t.dashboard.newConversation}
                </p>
                <p className="text-xs text-text-secondary dark:text-slate-400">
                  {new Date(conv.updated_at).toLocaleDateString(appLanguage === 'es' ? 'es-ES' : appLanguage === 'pt' ? 'pt-BR' : appLanguage === 'fr' ? 'fr-FR' : 'en-US')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-card dark:bg-slate-800 rounded-xl border-2 border-border dark:border-slate-700 flex flex-col overflow-hidden">
          {selectedConversationId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border dark:border-slate-700 flex items-center justify-between">
                    <div className="flex-1">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        onBlur={handleSaveTitle}
                        autoFocus
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-primary bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                      />
                      <button
                        onClick={handleSaveTitle}
                        className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
                        aria-label={t.dashboard.saveLabel}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEditTitle}
                        className="p-2 rounded-lg bg-text-secondary/10 dark:bg-slate-700 text-text-secondary dark:text-slate-300 hover:bg-text-secondary/20 dark:hover:bg-slate-600 transition-colors"
                        aria-label={t.dashboard.cancelLabel}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h3 
                        className="font-semibold text-text-primary dark:text-white cursor-pointer hover:text-primary transition-colors"
                        onClick={handleStartEditTitle}
                        title={t.dashboard.clickToEdit}
                      >
                        {selectedConversation?.title || t.dashboard.newConversation}
                      </h3>
                      <button
                        onClick={handleStartEditTitle}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#F8FAF9] dark:hover:bg-slate-700 transition-all"
                        aria-label={t.dashboard.editNameLabel}
                      >
                        <svg className="w-4 h-4 text-text-secondary dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ backgroundColor: isDarkMode ? '#0F172A' : '#F8FAF9' }}
              >
                {messagesLoading ? (
                  <div className="text-center text-text-secondary dark:text-slate-400">{t.dashboard.loadingMessages}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-text-secondary dark:text-slate-400 py-8">
                    {getInitialMessage(appLanguage)}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-3 ${msg.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      {msg.sender === 'assistant' && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                          style={{ backgroundColor: 'var(--chat-primary)' }}
                        >
                          H
                        </div>
                      )}
                      <div
                        className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm"
                        style={{
                          fontSize: `${fontSize}px`,
                          borderRadius: `${borderRadius}px`,
                          backgroundColor:
                            msg.sender === 'assistant'
                              ? 'var(--chat-primary-soft)'
                              : isDarkMode
                              ? '#1E293B'
                              : '#FFFFFF',
                          color: msg.sender === 'assistant' ? '#0F172A' : isDarkMode ? '#FFFFFF' : '#0F172A',
                          transition: 'font-size 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        <span 
                          className="text-text-secondary dark:text-slate-400 block mt-2"
                          style={{
                            fontSize: `${Math.max(8, fontSize - 6)}px`,
                            transition: 'font-size 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                          U
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex items-end gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: 'var(--chat-primary)' }}>
                      H
                    </div>
                    <div className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm" style={{ backgroundColor: 'var(--chat-primary-soft)' }}>
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border dark:border-slate-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder={t.dashboard.typeMessage}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--chat-primary)' }}
                  >
                    {t.dashboard.sendMessage}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-secondary dark:text-slate-400">
              {t.dashboard.selectConversation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
