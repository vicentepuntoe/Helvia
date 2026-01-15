import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { translations, type Language } from '../../locales/translations';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

type ActiveView = 'chat' | 'personalize' | 'settings';
type ColorTheme = 'Verde' | 'Azul' | 'Púrpura';

interface PersonalizationSettings {
  fontSize: number;
  borderRadius: number;
}

// Color theme definitions (moved outside component to avoid dependency issues)
const colorThemes = {
  Verde: {
    primary: '#16A34A',
    primaryHover: '#15803D',
    primarySoft: '#DCFCE7',
  },
  Azul: {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primarySoft: '#DBEAFE',
  },
  Púrpura: {
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    primarySoft: '#EDE9FE',
  },
};

const DashboardPreview = () => {
  // Get web app language and theme from context
  const { language: appLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const appT = translations[appLanguage];

  // Chat language state (independent from app language, but initializes from web app language)
  const [chatLanguage, setChatLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat-language');
      const validLanguages: Language[] = ['es', 'en', 'pt', 'fr'];
      if (saved && validLanguages.includes(saved as Language)) {
        return saved as Language;
      }
    }
    // If no saved language, use the web app language as default
    return appLanguage;
  });

  const chatT = translations[chatLanguage];

  // Chat state - initial message based on chat language
  const getInitialMessage = React.useCallback((lang: Language) => {
    const initialMessages: Record<Language, string> = {
      es: "¡Hola! Soy Helvia, tu asistente de IA. Estoy aquí para ayudarte con cualquier pregunta sobre nuestra plataforma, soporte al cliente o cómo podemos ayudar a tu negocio. ¿Cómo puedo ayudarte hoy?",
      en: "Hello! I'm Helvia, your AI assistant. I'm here to help you with any questions about our platform, customer support, or how we can assist your business. How can I help you today?",
      pt: "Olá! Sou Helvia, sua assistente de IA. Estou aqui para ajudá-lo com qualquer dúvida sobre nossa plataforma, suporte ao cliente ou como podemos ajudar seu negócio. Como posso ajudá-lo hoje?",
      fr: "Bonjour! Je suis Helvia, votre assistante IA. Je suis ici pour vous aider avec toutes vos questions sur notre plateforme, le support client ou comment nous pouvons aider votre entreprise. Comment puis-je vous aider aujourd'hui?",
    };
    return initialMessages[lang];
  }, []);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: `initial-${chatLanguage}-${Date.now()}`,
      text: getInitialMessage(chatLanguage),
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);

  // Sync chat language with web app language when web app language changes (only if chat hasn't started)
  useEffect(() => {
    // Only sync if chat is empty (just initial message)
    const timeoutId = setTimeout(() => {
      if (messages.length === 1 && messages[0].sender === 'assistant' && chatLanguage !== appLanguage) {
        setChatLanguage(appLanguage);
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [appLanguage, chatLanguage, messages]); // Include messages as dependency

  // Update initial message when chat language changes (only if chat hasn't started)
  useEffect(() => {
    // Use setTimeout to avoid calling setState synchronously in effect
    const timeoutId = setTimeout(() => {
      setMessages((prevMessages) => {
        // Only update if there's only the initial message (no user messages yet)
        if (prevMessages.length === 1 && prevMessages[0].sender === 'assistant') {
          const newMessage = getInitialMessage(chatLanguage);
          // Always update to ensure it matches the current language
          // Use a new ID to force React to re-render
          return [{
            id: `initial-${chatLanguage}-${Date.now()}`,
            text: newMessage,
            sender: 'assistant',
            timestamp: new Date(),
          }];
        }
        return prevMessages;
      });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [chatLanguage, getInitialMessage]);

  // Save chat language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chat-language', chatLanguage);
  }, [chatLanguage]);

  const stats = [
    { label: appT.dashboard.stats1Label, value: '143.683' },
    { label: appT.dashboard.stats2Label, value: '2.3 min' },
    { label: appT.dashboard.stats3Label, value: '40%' },
    { label: appT.dashboard.stats4Label, value: '94%' },
  ];

  // Active view state
  const [activeView, setActiveView] = useState<ActiveView>('chat');

  // Personalization settings (applied)
  const [personalization, setPersonalization] = useState<PersonalizationSettings>({
    fontSize: 14,
    borderRadius: 16,
  });

  // Pending personalization settings (temporary, not yet applied)
  const [pendingPersonalization, setPendingPersonalization] = useState<PersonalizationSettings>({
    fontSize: 14,
    borderRadius: 16,
  });

  // Color theme state
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat-color-theme');
      if (saved === 'Verde' || saved === 'Azul' || saved === 'Púrpura') {
        return saved as ColorTheme;
      }
    }
    return 'Verde'; // Default theme
  });

  // Apply color theme to CSS variables
  useEffect(() => {
    const theme = colorThemes[colorTheme];
    const root = document.documentElement;
    root.style.setProperty('--chat-primary', theme.primary);
    root.style.setProperty('--chat-primary-hover', theme.primaryHover);
    root.style.setProperty('--chat-primary-soft', theme.primarySoft);
  }, [colorTheme]);

  // Save color theme to localStorage
  useEffect(() => {
    localStorage.setItem('chat-color-theme', colorTheme);
  }, [colorTheme]);

  // Initialize pending personalization when entering personalize view
  useEffect(() => {
    if (activeView === 'personalize') {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setPendingPersonalization(personalization);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [activeView, personalization]);

  // Notification state
  const [showAppliedNotification, setShowAppliedNotification] = useState(false);

  // Sound notification state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat-sound-enabled');
      return saved !== null ? saved === 'true' : true; // Default to enabled
    }
    return true;
  });

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem('chat-sound-enabled', soundEnabled.toString());
  }, [soundEnabled]);

  // Function to play notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    try {
      // Create a simple notification sound using Web Audio API
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure sound: pleasant notification tone
      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine'; // Sine wave for a smooth tone
      
      // Envelope: quick attack, smooth decay
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15); // Smooth decay
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15); // Short duration
    } catch (error) {
      // Fallback: silently fail if audio context is not available
      console.warn('Could not play notification sound:', error);
    }
  };

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to scroll to bottom with smooth transition
  const scrollToBottom = (force: boolean = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      if (force) {
        // Force scroll to bottom with smooth behavior (when user sends a message or receives a response)
        // Use multiple attempts to ensure proper positioning
        const scrollToEnd = () => {
          if (messagesContainerRef.current) {
            const scrollHeight = messagesContainerRef.current.scrollHeight;
            // Scroll to the very bottom, adding a small buffer to ensure input is visible
            messagesContainerRef.current.scrollTo({
              top: scrollHeight + 100, // Add buffer to ensure input area is visible
              behavior: 'smooth'
            });
          }
        };
        
        // First attempt after a short delay
        setTimeout(scrollToEnd, 50);
        // Second attempt after DOM updates
        requestAnimationFrame(() => {
          setTimeout(scrollToEnd, 150);
        });
      } else {
        // Only scroll if user is near the bottom (within 100px) - for auto-updates
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        if (isNearBottom) {
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const scrollHeight = messagesContainerRef.current.scrollHeight;
              messagesContainerRef.current.scrollTo({
                top: scrollHeight,
                behavior: 'smooth'
              });
            }
          }, 50);
        }
      }
    }
  };

  // Scroll to bottom when new messages arrive (only if user is near bottom, to not interrupt reading)
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom(false); // Don't force, only if near bottom
    }
  }, [messages]);

  // Prevent auto-focus on mount - ensure input is NEVER focused on page load
  useEffect(() => {
    // Immediate blur if somehow focused
    if (inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.blur();
    }
    
    // Also check after render
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.blur();
        // Make input not focusable initially
        inputRef.current.tabIndex = -1;
      }
    }, 50);

    // After a delay, make it focusable again (when user might want to interact)
    const enableFocusId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.tabIndex = 0;
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(enableFocusId);
    };
  }, []);

  // Detect language from user message with improved accuracy
  const detectLanguage = (message: string): Language => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Spanish indicators (expanded list)
    const spanishWords = [
      'hola', 'holi', 'hi', 'hey', 'buenos', 'buenas', 'días', 'día', 'tardes', 'noches',
      'gracias', 'muchas gracias', 'por favor', 'ayuda', 'necesito', 'necesito ayuda',
      'pedido', 'precio', 'precios', 'información', 'cómo', 'qué', 'cuándo', 'dónde', 'quién',
      'español', 'española', 'hablas español', 'habla español',
      'no sé', 'no se', 'que hacer', 'qué hacer', 'que hago', 'qué hago',
      'puedes', 'puedo', 'quiero', 'me gustaría', 'dame', 'déjame',
      'si', 'sí', 'no', 'también', 'más', 'menos', 'muy', 'mucho', 'poco',
      'empresa', 'negocio', 'servicio', 'producto', 'cliente', 'clientes'
    ];
    
    // Portuguese indicators (expanded list)
    const portugueseWords = [
      'olá', 'oi', 'opa', 'e aí', 'tudo bem', 'tudo bom',
      'obrigado', 'obrigada', 'valeu', 'por favor', 'ajuda', 'preciso', 'preciso ajuda',
      'pedido', 'preço', 'preços', 'informação', 'como', 'quando', 'onde', 'quem',
      'português', 'portuguesa', 'fala português', 'fala português',
      'não sei', 'o que fazer', 'o que faço',
      'pode', 'posso', 'quero', 'gostaria', 'me dê', 'deixa',
      'sim', 'não', 'também', 'mais', 'menos', 'muito', 'pouco',
      'empresa', 'negócio', 'serviço', 'produto', 'cliente', 'clientes'
    ];
    
    // French indicators (expanded list)
    const frenchWords = [
      'bonjour', 'bonsoir', 'salut', 'coucou', 'allo',
      'merci', 'merci beaucoup', 's\'il vous plaît', 's\'il te plaît', 'aide', 'besoin', 'j\'ai besoin',
      'commande', 'prix', 'prix', 'information', 'comment', 'quand', 'où', 'qui',
      'français', 'française', 'parlez français', 'parle français',
      'je ne sais pas', 'que faire', 'que dois-je faire',
      'pouvez', 'peux', 'je veux', 'je voudrais', 'donnez-moi', 'laissez',
      'oui', 'non', 'aussi', 'plus', 'moins', 'très', 'beaucoup', 'peu',
      'entreprise', 'affaires', 'service', 'produit', 'client', 'clients'
    ];
    
    // English indicators (to help distinguish from other languages)
    const englishWords = [
      'hello', 'hi', 'hey', 'thanks', 'thank you', 'please', 'help', 'need', 'i need',
      'order', 'price', 'pricing', 'information', 'how', 'what', 'when', 'where', 'who',
      'english', 'speak english', 'do you speak english',
      'i don\'t know', 'what to do', 'what should i do',
      'can you', 'can i', 'i want', 'i would like', 'give me', 'let me',
      'yes', 'no', 'also', 'more', 'less', 'very', 'much', 'little',
      'company', 'business', 'service', 'product', 'customer', 'customers'
    ];
    
    // Count matches for each language
    let spanishCount = 0;
    let portugueseCount = 0;
    let frenchCount = 0;
    let englishCount = 0;
    
    // Check for exact word matches (more weight)
    spanishWords.forEach(word => {
      // Check for exact word match or as part of a phrase
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        spanishCount += 2;
      } else if (lowerMessage.includes(word)) {
        spanishCount += 1;
      }
    });
    
    portugueseWords.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        portugueseCount += 2;
      } else if (lowerMessage.includes(word)) {
        portugueseCount += 1;
      }
    });
    
    frenchWords.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        frenchCount += 2;
      } else if (lowerMessage.includes(word)) {
        frenchCount += 1;
      }
    });
    
    englishWords.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        englishCount += 2;
      } else if (lowerMessage.includes(word)) {
        englishCount += 1;
      }
    });
    
    // Check for common Spanish patterns (strong indicators)
    if (lowerMessage.includes('ñ') || lowerMessage.includes('¿') || lowerMessage.includes('¡')) {
      spanishCount += 3;
    }
    if (lowerMessage.includes('qué') || lowerMessage.includes('cómo') || lowerMessage.includes('dónde')) {
      spanishCount += 2;
    }
    
    // Check for common Portuguese patterns
    if (lowerMessage.includes('ã') || lowerMessage.includes('õ') || lowerMessage.includes('ç')) {
      portugueseCount += 3;
    }
    if (lowerMessage.includes('não') || lowerMessage.includes('você') || lowerMessage.includes('vocês')) {
      portugueseCount += 2;
    }
    
    // Check for common French patterns
    if (lowerMessage.includes('é') || lowerMessage.includes('è') || lowerMessage.includes('ê') || lowerMessage.includes('à') || lowerMessage.includes('ç')) {
      frenchCount += 3;
    }
    if (lowerMessage.includes('vous') || lowerMessage.includes('nous') || lowerMessage.includes('je ')) {
      frenchCount += 2;
    }
    
    // Special patterns
    if (lowerMessage.match(/\bno\s+se\b/i) || lowerMessage.match(/\bno\s+sé\b/i)) {
      spanishCount += 3; // "no sé" or "no se" is very Spanish
    }
    if (lowerMessage.match(/\bque\s+hacer\b/i) || lowerMessage.match(/\bqué\s+hacer\b/i)) {
      spanishCount += 3; // "qué hacer" is very Spanish
    }
    
    // Determine language based on highest count
    const counts = [
      { lang: 'es' as Language, count: spanishCount },
      { lang: 'pt' as Language, count: portugueseCount },
      { lang: 'fr' as Language, count: frenchCount },
      { lang: 'en' as Language, count: englishCount },
    ];
    
    counts.sort((a, b) => b.count - a.count);
    
    // If top language has a count > 0, use it; otherwise use current chat language
    if (counts[0].count > 0) {
      return counts[0].lang;
    }
    
    // Fallback to current chat language if no clear detection
    return chatLanguage;
  };

  // Simulated responses based on user input and detected language
  const getResponse = (userMessage: string, detectedLang: Language): string => {
    const lowerMessage = userMessage.toLowerCase();
    const responses: Record<Language, Record<string, string>> = {
      es: {
        order: "¡Estaré encantado de ayudarte con tu pedido! ¿Podrías proporcionarme tu número de pedido o la dirección de correo electrónico asociada con tu cuenta?",
        price: "Nuestros precios son flexibles y se basan en las necesidades de tu negocio. Ofrecemos planes para empresas de todos los tamaños. ¿Te gustaría que te conecte con nuestro equipo de ventas para discutir la mejor opción para tu empresa?",
        feature: "Helvia ofrece respuestas automatizadas 24/7, enrutamiento inteligente de conversaciones, colaboración fluida del equipo, analíticas de respuesta, soporte multicanal y flujos de trabajo personalizables. ¿Qué característica te gustaría conocer más?",
        integrate: "Nos integramos con plataformas populares como WhatsApp, correo electrónico, widgets de chat y plataformas de mensajería. También ofrecemos una API completa para integraciones personalizadas. ¿Te gustaría más detalles sobre una integración específica?",
        demo: "¡Por supuesto! Puedo ayudarte a configurar una demostración o prueba. Déjame conectarte con nuestro equipo. ¿Podrías compartir el nombre de tu empresa y tu dirección de correo electrónico?",
        hello: "¡Hola! ¿Cómo puedo ayudarte hoy? Estoy aquí para responder cualquier pregunta sobre Helvia o ayudarte a comenzar.",
        default: "Gracias por tu mensaje! Entiendo que estás preguntando sobre: \"" + userMessage + "\". Déjame ayudarte con eso. ¿Podrías proporcionar un poco más de contexto para poder darte la información más precisa?",
      },
      en: {
        order: "I'd be happy to help you with your order! Could you please provide me with your order number or the email address associated with your account?",
        price: "Our pricing is flexible and based on your business needs. We offer plans for businesses of all sizes. Would you like me to connect you with our sales team to discuss the best option for your company?",
        feature: "Helvia offers 24/7 automated responses, intelligent conversation routing, seamless team collaboration, response analytics, multi-channel support, and customizable workflows. Which feature would you like to learn more about?",
        integrate: "We integrate with popular platforms like WhatsApp, email, chat widgets, and messaging platforms. We also offer a comprehensive API for custom integrations. Would you like more details about a specific integration?",
        demo: "Absolutely! I can help you set up a demo or trial. Let me connect you with our team. Could you please share your company name and email address?",
        hello: "Hello! How can I assist you today? I'm here to answer any questions about Helvia or help you get started.",
        default: "Thank you for your message! I understand you're asking about: \"" + userMessage + "\". Let me help you with that. Could you provide a bit more context so I can give you the most accurate information?",
      },
      pt: {
        order: "Ficaria feliz em ajudá-lo com seu pedido! Você poderia me fornecer o número do seu pedido ou o endereço de e-mail associado à sua conta?",
        price: "Nossos preços são flexíveis e baseados nas necessidades do seu negócio. Oferecemos planos para empresas de todos os tamanhos. Gostaria que eu o conecte com nossa equipe de vendas para discutir a melhor opção para sua empresa?",
        feature: "Helvia oferece respostas automatizadas 24/7, roteamento inteligente de conversas, colaboração perfeita da equipe, análises de resposta, suporte multicanal e fluxos de trabalho personalizáveis. Qual recurso você gostaria de saber mais?",
        integrate: "Nos integramos com plataformas populares como WhatsApp, e-mail, widgets de chat e plataformas de mensagens. Também oferecemos uma API abrangente para integrações personalizadas. Gostaria de mais detalhes sobre uma integração específica?",
        demo: "Absolutamente! Posso ajudá-lo a configurar uma demonstração ou teste. Deixe-me conectá-lo com nossa equipe. Você poderia compartilhar o nome da sua empresa e endereço de e-mail?",
        hello: "Olá! Como posso ajudá-lo hoje? Estou aqui para responder qualquer pergunta sobre Helvia ou ajudá-lo a começar.",
        default: "Obrigado pela sua mensagem! Entendo que você está perguntando sobre: \"" + userMessage + "\". Deixe-me ajudá-lo com isso. Você poderia fornecer um pouco mais de contexto para que eu possa dar as informações mais precisas?",
      },
      fr: {
        order: "Je serais ravi de vous aider avec votre commande! Pourriez-vous me fournir le numéro de votre commande ou l'adresse e-mail associée à votre compte?",
        price: "Nos tarifs sont flexibles et basés sur les besoins de votre entreprise. Nous proposons des forfaits pour les entreprises de toutes tailles. Souhaitez-vous que je vous mette en contact avec notre équipe commerciale pour discuter de la meilleure option pour votre entreprise?",
        feature: "Helvia offre des réponses automatisées 24/7, un routage intelligent des conversations, une collaboration d'équipe fluide, des analyses de réponse, un support multicanal et des flux de travail personnalisables. Quelle fonctionnalité souhaitez-vous découvrir?",
        integrate: "Nous nous intégrons avec des plateformes populaires comme WhatsApp, e-mail, widgets de chat et plateformes de messagerie. Nous proposons également une API complète pour des intégrations personnalisées. Souhaitez-vous plus de détails sur une intégration spécifique?",
        demo: "Absolument! Je peux vous aider à configurer une démo ou un essai. Laissez-moi vous connecter avec notre équipe. Pourriez-vous partager le nom de votre entreprise et votre adresse e-mail?",
        hello: "Bonjour! Comment puis-je vous aider aujourd'hui? Je suis ici pour répondre à toutes vos questions sur Helvia ou vous aider à commencer.",
        default: "Merci pour votre message! Je comprends que vous demandez à propos de: \"" + userMessage + "\". Laissez-moi vous aider avec cela. Pourriez-vous fournir un peu plus de contexte pour que je puisse vous donner les informations les plus précises?",
      },
    };

    const langResponses = responses[detectedLang];
    
    // Check for order-related keywords in all languages
    if (lowerMessage.includes('order') || lowerMessage.includes('pedido') || lowerMessage.includes('commande') || lowerMessage.includes('ordem')) {
      return langResponses.order;
    }
    
    // Check for price-related keywords in all languages
    if (lowerMessage.includes('price') || lowerMessage.includes('precio') || lowerMessage.includes('preço') || lowerMessage.includes('prix') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('plan') || lowerMessage.includes('tarif') || lowerMessage.includes('custo')) {
      return langResponses.price;
    }
    
    // Check for feature-related keywords in all languages
    if (lowerMessage.includes('feature') || lowerMessage.includes('característica') || lowerMessage.includes('recurso') || lowerMessage.includes('fonctionnalité') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities') || lowerMessage.includes('funcionalidad') || lowerMessage.includes('funcionalidade')) {
      return langResponses.feature;
    }
    
    // Check for integration-related keywords in all languages
    if (lowerMessage.includes('integrate') || lowerMessage.includes('integrar') || lowerMessage.includes('intégrer') || lowerMessage.includes('api') || lowerMessage.includes('connect') || lowerMessage.includes('conectar') || lowerMessage.includes('connexion')) {
      return langResponses.integrate;
    }
    
    // Check for demo/trial-related keywords in all languages
    if (lowerMessage.includes('demo') || lowerMessage.includes('trial') || lowerMessage.includes('test') || lowerMessage.includes('try') || lowerMessage.includes('prueba') || lowerMessage.includes('teste') || lowerMessage.includes('essai') || lowerMessage.includes('probar') || lowerMessage.includes('experimentar')) {
      return langResponses.demo;
    }
    
    // Check for greeting keywords in all languages
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('hola') || lowerMessage.includes('olá') || lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('oi') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
      return langResponses.hello;
    }
    
    return langResponses.default;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Force scroll to bottom when user sends a message
    scrollToBottom(true);

    // Detect language from user message
    const detectedLanguage = detectLanguage(userMessage.text);
    
    // Update chat language if detected language is different and has a strong signal
    // This allows the chat to adapt to the user's language automatically
    if (detectedLanguage !== chatLanguage) {
      setChatLanguage(detectedLanguage);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getResponse(userMessage.text, detectedLanguage),
      sender: 'assistant',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantResponse]);
    
    // Play notification sound when assistant responds
    playNotificationSound();
    
    // Force scroll to bottom when assistant responds
    scrollToBottom(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const updatePersonalization = (key: keyof PersonalizationSettings, value: string | number) => {
    // Apply changes immediately
    setPersonalization((prev) => ({ ...prev, [key]: value }));
    setPendingPersonalization((prev) => ({ ...prev, [key]: value }));
    // Show notification
    setShowAppliedNotification(true);
    setTimeout(() => setShowAppliedNotification(false), 2000);
  };

  const resetPersonalization = () => {
    const defaultSettings: PersonalizationSettings = {
      fontSize: 14,
      borderRadius: 16,
    };
    setPersonalization(defaultSettings);
    setPendingPersonalization(defaultSettings);
    // Show notification
    setShowAppliedNotification(true);
    setTimeout(() => setShowAppliedNotification(false), 2000);
  };

  return (
    <section id="how-it-works" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid - Moved to top */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-card dark:bg-slate-800 p-4 sm:p-6 lg:p-8 rounded-xl border-2 border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-slate-400 mb-2 sm:mb-3 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 line-clamp-2">{stat.label}</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-white mb-4">
            {appT.dashboard.title}
          </h2>
          <p className="text-lg text-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
            {appT.dashboard.subtitle}
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-card dark:bg-slate-800 rounded-xl shadow-xl border-2 border-border dark:border-slate-700 overflow-hidden transition-colors duration-300">
          <div className="bg-[#F8FAF9] dark:bg-slate-900 border-b border-border dark:border-slate-700 px-6 py-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-3 space-y-4">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveView('chat')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                      activeView === 'chat'
                        ? 'bg-primary-soft dark:bg-primary/20 border border-primary/20 dark:border-primary/30'
                        : 'hover:bg-[#F8FAF9] dark:hover:bg-slate-800 border border-transparent hover:border-border dark:hover:border-slate-700'
                    }`}
                  >
                    <svg className={`w-5 h-5 transition-colors duration-200 ${
                      activeView === 'chat' 
                        ? 'text-primary' 
                        : 'text-text-secondary dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className={`font-medium text-sm transition-colors duration-200 ${
                      activeView === 'chat' 
                        ? 'text-text-primary dark:text-white font-semibold' 
                        : 'text-text-secondary dark:text-slate-400 group-hover:text-text-primary dark:group-hover:text-white'
                    }`}>{appT.dashboard.sidebarChat}</span>
                  </button>
                  <button
                    onClick={() => setActiveView('personalize')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                      activeView === 'personalize'
                        ? 'bg-primary-soft dark:bg-primary/20 border border-primary/20 dark:border-primary/30'
                        : 'hover:bg-[#F8FAF9] dark:hover:bg-slate-800 border border-transparent hover:border-border dark:hover:border-slate-700'
                    }`}
                  >
                    <svg className={`w-5 h-5 transition-colors duration-200 ${
                      activeView === 'personalize' 
                        ? 'text-primary' 
                        : 'text-text-secondary dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className={`font-medium text-sm transition-colors duration-200 ${
                      activeView === 'personalize' 
                        ? 'text-text-primary dark:text-white font-semibold' 
                        : 'text-text-secondary dark:text-slate-400 group-hover:text-text-primary dark:group-hover:text-white'
                    }`}>{appT.dashboard.sidebarPersonalize}</span>
                  </button>
                  <button
                    onClick={() => setActiveView('settings')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                      activeView === 'settings'
                        ? 'bg-primary-soft dark:bg-primary/20 border border-primary/20 dark:border-primary/30'
                        : 'hover:bg-[#F8FAF9] dark:hover:bg-slate-800 border border-transparent hover:border-border dark:hover:border-slate-700'
                    }`}
                  >
                    <svg className={`w-5 h-5 transition-colors duration-200 ${
                      activeView === 'settings' 
                        ? 'text-primary' 
                        : 'text-text-secondary dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={`font-medium text-sm transition-colors duration-200 ${
                      activeView === 'settings' 
                        ? 'text-text-primary dark:text-white font-semibold' 
                        : 'text-text-secondary dark:text-slate-400 group-hover:text-text-primary dark:group-hover:text-white'
                    }`}>{appT.dashboard.sidebarSettings}</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9 flex flex-col relative" style={{ height: '600px' }}>
                {/* Applied Notification */}
                {showAppliedNotification && (
                  <div className="absolute top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in-up" style={{ backgroundColor: 'var(--chat-primary)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">{appT.dashboard.appliedNotification}</span>
                  </div>
                )}

                {activeView === 'chat' && (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border dark:border-slate-700">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm transition-all duration-300 flex-shrink-0"
                        style={{ 
                          backgroundColor: 'var(--chat-primary)',
                          color: 'rgba(255, 255, 255, 0.95)'
                        }}
                      >
                        H
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text-primary dark:text-white">{chatT.dashboard.chatHeaderTitle}</div>
                        <div className="text-xs text-text-secondary dark:text-slate-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--chat-primary)' }}></span>
                          {chatT.dashboard.chatHeaderOnline}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newInitialMessage = getInitialMessage(chatLanguage);
                          setMessages([{
                            id: `initial-${chatLanguage}-${Date.now()}`,
                            text: newInitialMessage,
                            sender: 'assistant',
                            timestamp: new Date(),
                          }]);
                        }}
                        className="p-2 rounded-lg hover:bg-[#F8FAF9] dark:hover:bg-slate-800 transition-colors duration-200"
                        aria-label="Reset conversation"
                      >
                        <svg className="w-5 h-5 text-text-secondary dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>

                    {/* Messages Area */}
                    <div 
                      ref={messagesContainerRef}
                      className="flex-1 overflow-y-auto px-2 py-4 space-y-4 rounded-lg mb-4 transition-colors duration-300"
                      style={{ 
                        scrollBehavior: 'smooth',
                        backgroundColor: isDarkMode ? '#0F172A' : '#F8FAF9',
                        transition: 'background-color 0.3s ease-in-out',
                      }}
                    >
                      {messages.map((message) => (
                        <div
                          key={`${message.id}-${chatLanguage}`}
                          className={`flex items-end gap-3 ${
                            message.sender === 'assistant' ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          {message.sender === 'assistant' && (
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm transition-all duration-300 flex-shrink-0"
                              style={{ 
                                backgroundColor: 'var(--chat-primary)',
                                color: 'rgba(255, 255, 255, 0.95)'
                              }}
                            >
                              H
                            </div>
                          )}

                          <div
                            className="max-w-[75%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 ease-in-out"
                            style={{
                              fontSize: `${personalization.fontSize}px`,
                              borderRadius: `${personalization.borderRadius}px`,
                              backgroundColor: message.sender === 'assistant' 
                                ? 'var(--chat-primary-soft)' 
                                : isDarkMode 
                                  ? '#1E293B' 
                                  : '#FFFFFF',
                              color: message.sender === 'assistant'
                                ? isDarkMode
                                  ? '#0F172A' // Texto oscuro en modo oscuro para mensajes del asistente (fondo claro)
                                  : '#0F172A' // Texto oscuro en modo claro
                                : isDarkMode
                                  ? '#FFFFFF' // Texto blanco en modo oscuro para mensajes del usuario (fondo oscuro)
                                  : '#0F172A', // Texto oscuro en modo claro
                              transition: 'font-size 0.3s ease-in-out, border-radius 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out',
                            }}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap break-words">
                              {message.text}
                            </p>
                            <span className={`text-[10px] text-text-secondary dark:text-slate-400 block mt-2 ${
                              message.sender === 'assistant' ? 'text-left' : 'text-right'
                            }`}>
                              {formatTime(message.timestamp)}
                              {message.sender === 'assistant' && (
                                <span className="ml-1">✓✓</span>
                              )}
                            </span>
                          </div>

                          {message.sender === 'user' && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm flex-shrink-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
                              C
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex items-end gap-3 justify-start">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm transition-all duration-300 flex-shrink-0"
                            style={{ 
                              backgroundColor: 'var(--chat-primary)',
                              color: 'rgba(255, 255, 255, 0.95)'
                            }}
                          >
                            H
                          </div>
                          <div className="max-w-[75%] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm" style={{ backgroundColor: 'var(--chat-primary-soft)', borderColor: 'var(--chat-primary)' }}>
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

                    {/* Input Area */}
                    <div className="border-t border-border dark:border-slate-700 pt-4">
                      <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={chatT.dashboard.chatPlaceholder}
                            disabled={isTyping}
                            autoFocus={false}
                            tabIndex={activeView === 'chat' ? 0 : -1}
                            onMouseDown={() => {
                              // Allow focus only on explicit user click
                              if (inputRef.current) {
                                inputRef.current.tabIndex = 0;
                              }
                            }}
                            className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ '--tw-ring-color': 'var(--chat-primary)' } as React.CSSProperties}
                            onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px var(--chat-primary)`}
                            onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                          />
                          {inputValue && (
                            <button
                              onClick={() => setInputValue('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-border dark:hover:bg-slate-700 transition-colors duration-200"
                              aria-label="Clear input"
                            >
                              <svg className="w-4 h-4 text-text-secondary dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <button
                          onClick={handleSend}
                          disabled={!inputValue.trim() || isTyping}
                          className="text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex-shrink-0"
                          style={{ backgroundColor: 'var(--chat-primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--chat-primary-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--chat-primary)'}
                          aria-label="Send message"
                        >
                          {isTyping ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-slate-400 mt-2 text-center">
                        {chatT.dashboard.chatHint}
                      </p>
                    </div>
                  </>
                )}

                {activeView === 'personalize' && (
                  <div className="flex-1 overflow-y-auto">
                    <div className="pb-4 mb-4 border-b border-border dark:border-slate-700">
                      <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">{appT.dashboard.personalizeTitle}</h3>
                      <p className="text-sm text-text-secondary dark:text-slate-400">{appT.dashboard.personalizeSubtitle}</p>
                    </div>

                    <div className="space-y-6">
                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-white mb-3">
                          {appT.dashboard.fontSizeLabel}: {pendingPersonalization.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          value={pendingPersonalization.fontSize}
                          onChange={(e) => updatePersonalization('fontSize', parseInt(e.target.value))}
                          className="w-full h-2 bg-border dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-300"
                          style={{ transition: 'all 0.3s ease-in-out' }}
                        />
                        <div className="flex justify-between text-xs text-text-secondary dark:text-slate-400 mt-1">
                          <span>{appT.dashboard.fontSizeMin}</span>
                          <span>{appT.dashboard.fontSizeMax}</span>
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-white mb-3">
                          {appT.dashboard.borderRadiusLabel}: {pendingPersonalization.borderRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={pendingPersonalization.borderRadius}
                          onChange={(e) => updatePersonalization('borderRadius', parseInt(e.target.value))}
                          className="w-full h-2 bg-border dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-300"
                          style={{ transition: 'all 0.3s ease-in-out' }}
                        />
                        <div className="flex justify-between text-xs text-text-secondary dark:text-slate-400 mt-1">
                          <span>{appT.dashboard.borderRadiusMin}</span>
                          <span>{appT.dashboard.borderRadiusMax}</span>
                        </div>
                      </div>


                      {/* Reset Button */}
                      <button
                        onClick={resetPersonalization}
                        className="w-full bg-text-secondary dark:bg-slate-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-text-primary dark:hover:bg-slate-600 transition-all duration-200 mb-4"
                      >
                        {appT.dashboard.resetButton}
                      </button>

                      {/* Back to Chat Button */}
                      <button
                        onClick={() => setActiveView('chat')}
                        className="w-full text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        style={{ backgroundColor: 'var(--chat-primary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--chat-primary-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--chat-primary)'}
                      >
                        {appT.dashboard.backButton}
                      </button>
                    </div>
                  </div>
                )}

                {activeView === 'settings' && (
                  <div className="flex-1 overflow-y-auto">
                    <div className="pb-4 mb-4 border-b border-border dark:border-slate-700">
                      <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">{appT.dashboard.settingsTitle}</h3>
                      <p className="text-sm text-text-secondary dark:text-slate-400">{appT.dashboard.settingsSubtitle}</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border dark:border-slate-700">
                        <div>
                          <h4 className="font-semibold text-text-primary dark:text-white mb-1">{appT.dashboard.settingsSound}</h4>
                          <p className="text-sm text-text-secondary dark:text-slate-400">{appT.dashboard.settingsSoundDesc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={soundEnabled}
                            onChange={(e) => {
                              setSoundEnabled(e.target.checked);
                              // Play sound when enabling to give user feedback
                              if (e.target.checked) {
                                setTimeout(() => playNotificationSound(), 100);
                              }
                            }}
                          />
                          <div className="w-11 h-6 bg-border dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="p-4 rounded-lg border-2 border-border dark:border-slate-700">
                        <h4 className="font-semibold text-text-primary dark:text-white mb-3">{appT.dashboard.settingsLanguage} (Chat)</h4>
                        <select
                          value={chatLanguage}
                          onChange={(e) => {
                            const newLang = e.target.value as Language;
                            setChatLanguage(newLang);
                            // Force update initial message when language changes (only if chat hasn't started)
                            setMessages((prevMessages) => {
                              // Check if it's just the initial message
                              if (prevMessages.length === 1 && prevMessages[0].sender === 'assistant') {
                                const newMessage = getInitialMessage(newLang);
                                // Force update by creating a completely new object with new ID
                                return [{
                                  id: `initial-${newLang}-${Date.now()}`,
                                  text: newMessage,
                                  sender: 'assistant' as const,
                                  timestamp: new Date(),
                                }];
                              }
                              // If there are user messages, just update the language but keep messages
                              return prevMessages;
                            });
                          }}
                          className="w-full px-4 py-2 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                          <option value="pt">Português</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>

                      <div className="p-4 rounded-lg border-2 border-border dark:border-slate-700">
                        <h4 className="font-semibold text-text-primary dark:text-white mb-3">{appT.dashboard.settingsColorTheme}</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'Verde' as ColorTheme, label: appT.dashboard.colorThemeGreen },
                            { value: 'Azul' as ColorTheme, label: appT.dashboard.colorThemeBlue },
                            { value: 'Púrpura' as ColorTheme, label: appT.dashboard.colorThemePurple },
                          ].map((theme) => (
                            <button
                              key={theme.value}
                              onClick={() => {
                                setColorTheme(theme.value);
                                // Show notification when theme changes
                                setShowAppliedNotification(true);
                                setTimeout(() => setShowAppliedNotification(false), 2000);
                              }}
                              className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                colorTheme === theme.value
                                  ? isDarkMode
                                    ? 'border-[var(--chat-primary)] bg-slate-800 text-[var(--chat-primary)]'
                                    : 'border-[var(--chat-primary)] bg-[var(--chat-primary-soft)] text-[var(--chat-primary)]'
                                  : 'border-border dark:border-slate-700 hover:border-[var(--chat-primary)] dark:hover:border-[var(--chat-primary)] text-text-primary dark:text-white'
                              }`}
                            >
                              {theme.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Back to Chat Button */}
                      <button
                        onClick={() => setActiveView('chat')}
                        className="w-full text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        style={{ backgroundColor: 'var(--chat-primary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--chat-primary-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--chat-primary)'}
                      >
                        {appT.dashboard.backButton}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
