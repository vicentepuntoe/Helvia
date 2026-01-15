import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

const HelviaAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Helvia, your AI assistant. I'm here to help you with any questions about our platform, customer support, or how we can assist your business. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simulated responses based on user input
  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Order/support related
    if (lowerMessage.includes('order') || lowerMessage.includes('purchase')) {
      return "I'd be happy to help you with your order! Could you please provide me with your order number or the email address associated with your account?";
    }

    // Pricing related
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('plan')) {
      return "Our pricing is flexible and based on your business needs. We offer plans for businesses of all sizes. Would you like me to connect you with our sales team to discuss the best option for your company?";
    }

    // Features related
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
      return "Helvia offers 24/7 automated responses, intelligent conversation routing, seamless team collaboration, response analytics, multi-channel support, and customizable workflows. Which feature would you like to learn more about?";
    }

    // Integration related
    if (lowerMessage.includes('integrate') || lowerMessage.includes('api') || lowerMessage.includes('connect')) {
      return "We integrate with popular platforms like WhatsApp, email, chat widgets, and messaging platforms. We also offer a comprehensive API for custom integrations. Would you like more details about a specific integration?";
    }

    // Demo/trial related
    if (lowerMessage.includes('demo') || lowerMessage.includes('trial') || lowerMessage.includes('test') || lowerMessage.includes('try')) {
      return "Absolutely! I can help you set up a demo or trial. Let me connect you with our team. Could you please share your company name and email address?";
    }

    // General greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I assist you today? I'm here to answer any questions about Helvia or help you get started.";
    }

    // Default response
    return "Thank you for your message! I understand you're asking about: \"" + userMessage + "\". Let me help you with that. Could you provide a bit more context so I can give you the most accurate information?";
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

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getResponse(userMessage.text),
      sender: 'assistant',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantResponse]);
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

  return (
    <section id="how-it-works" className="pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F8FAF9]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Chat with Helvia
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Experience our AI assistant in real-time. Ask any question about our platform.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-card rounded-2xl shadow-2xl border-2 border-border overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '600px', maxHeight: '800px' }}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-4 flex items-center gap-3 border-b border-primary-hover">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white/20 backdrop-blur-sm relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white/30 absolute top-1 left-1"></div>
                <div className="w-4 h-4 rounded-full bg-white/40 absolute bottom-1 right-1"></div>
                <div className="w-3 h-3 rounded-full bg-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-base">Helvia AI</div>
              <div className="text-xs text-green-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                online
              </div>
            </div>
            <button
              onClick={() => setMessages([{
                id: '1',
                text: "Hello! I'm Helvia, your AI assistant. I'm here to help you with any questions about our platform, customer support, or how we can assist your business. How can I help you today?",
                sender: 'assistant',
                timestamp: new Date(),
              }])}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Reset conversation"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-[#F8FAF9] space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 ${
                  message.sender === 'user' ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white/30 absolute top-1 left-1"></div>
                      <div className="w-2 h-2 rounded-full bg-white/40 absolute bottom-1 right-1"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-white text-text-primary rounded-bl-md'
                      : 'bg-primary-soft text-text-primary rounded-br-md border border-primary/20'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  <span
                    className={`text-[10px] text-text-secondary block mt-2 ${
                      message.sender === 'user' ? 'text-right' : 'text-right'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                    {message.sender === 'assistant' && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </span>
                </div>

                {message.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary via-primary-hover to-primary-soft relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white/20 absolute top-1 left-1"></div>
                      <div className="w-2 h-2 rounded-full bg-white/30 absolute bottom-1 right-1"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-3 justify-end">
                <div className="max-w-[75%] sm:max-w-[65%] rounded-2xl rounded-br-md px-4 py-3 shadow-sm bg-primary-soft border border-primary/20">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-text-secondary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary via-primary-hover to-primary-soft relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white/20 absolute top-1 left-1"></div>
                    <div className="w-2 h-2 rounded-full bg-white/30 absolute bottom-1 right-1"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-card px-4 sm:px-6 py-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-border bg-[#F8FAF9] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-border transition-colors duration-200"
                    aria-label="Clear input"
                  >
                    <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary text-white p-3 rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex-shrink-0"
                aria-label="Send message"
              >
                {isTyping ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-text-secondary mt-2 text-center">
              Press Enter to send • Helvia is ready to help
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelviaAssistant;

