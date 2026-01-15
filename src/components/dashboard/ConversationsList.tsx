import { useState } from 'react';
import { useConversations } from '../../hooks/useConversations';
import { useMessages } from '../../hooks/useConversations';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../locales/translations';

const ConversationsList = () => {
  const { conversations, removeConversation, loading } = useConversations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages } = useMessages(selectedConversationId);
  const { language } = useLanguage();
  const t = translations[language];

  const filteredConversations = conversations.filter((conv) =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    searchQuery === ''
  );

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary dark:text-slate-400">{t.dashboard.loadingMessages}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* List */}
      <div className="w-1/3 bg-card dark:bg-slate-800 rounded-xl border-2 border-border dark:border-slate-700 p-4 flex flex-col">
        <div className="mb-4">
          <input
            type="text"
            placeholder={t.dashboard.searchConversations}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredConversations.length === 0 ? (
            <p className="text-center text-text-secondary dark:text-slate-400 py-8">
              {searchQuery ? t.dashboard.noConversationsFound : t.dashboard.noConversations}
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedConversationId === conv.id
                    ? 'border-primary bg-primary-soft dark:bg-primary/20'
                    : 'border-border dark:border-slate-700 hover:border-primary/50'
                }`}
                onClick={() => setSelectedConversationId(conv.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary dark:text-white truncate mb-1">
                      {conv.title || t.dashboard.noTitle}
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-slate-400">
                      {new Date(conv.updated_at).toLocaleDateString(language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : language === 'fr' ? 'fr-FR' : 'en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(t.dashboard.deleteConversation)) {
                        removeConversation(conv.id);
                        if (selectedConversationId === conv.id) {
                          setSelectedConversationId(null);
                        }
                      }
                    }}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 bg-card dark:bg-slate-800 rounded-xl border-2 border-border dark:border-slate-700 p-6">
        {selectedConversationId && selectedConversation ? (
          <div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-4">
              {selectedConversation.title || t.dashboard.noTitle}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-secondary dark:text-slate-400 mb-2">{t.dashboard.information}</p>
                <div className="bg-[#F8FAF9] dark:bg-slate-900 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary dark:text-slate-400">{t.dashboard.created}:</span>
                    <span className="text-text-primary dark:text-white">
                      {new Date(selectedConversation.created_at).toLocaleString(language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : language === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary dark:text-slate-400">{t.dashboard.updated}:</span>
                    <span className="text-text-primary dark:text-white">
                      {new Date(selectedConversation.updated_at).toLocaleString(language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : language === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary dark:text-slate-400">{t.dashboard.messages}:</span>
                    <span className="text-text-primary dark:text-white">{messages.length}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-text-secondary dark:text-slate-400 mb-2">{t.dashboard.messages}</p>
                <div className="bg-[#F8FAF9] dark:bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-center text-text-secondary dark:text-slate-400 py-4">
                      {t.dashboard.noMessages}
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                          msg.sender === 'assistant'
                            ? 'bg-primary-soft dark:bg-primary/20'
                            : 'bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-text-secondary dark:text-slate-400">
                            {msg.sender === 'assistant' ? t.dashboard.helviaLabel : t.dashboard.youLabel}
                          </span>
                          <span className="text-xs text-text-secondary dark:text-slate-400">
                            {new Date(msg.created_at).toLocaleTimeString(language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : language === 'fr' ? 'fr-FR' : 'en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-text-primary dark:text-white">{msg.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary dark:text-slate-400">
            {t.dashboard.selectConversation}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
