import { useState, useEffect } from 'react';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../locales/translations';
import { getUserSettings, createOrUpdateUserSettings } from '../../lib/supabase-tables';

type ColorTheme = 'Verde' | 'Azul' | 'Púrpura';

interface AdvancedSettingsProps {
  onBackToChat?: () => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ onBackToChat }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const [customPrompt, setCustomPrompt] = useState('');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('Verde');
  const [fontSize, setFontSize] = useState(14);
  const [borderRadius, setBorderRadius] = useState(16);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      try {
        const settings = await getUserSettings(user.id);
        if (settings) {
          setCustomPrompt(settings.custom_prompt || '');
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

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await createOrUpdateUserSettings(user.id, {
        custom_prompt: customPrompt,
        chat_theme: colorTheme,
        font_size: fontSize,
        border_radius: borderRadius,
        sound_enabled: soundEnabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white mb-2">{t.dashboard.settingsTitle}</h2>
        <p className="text-sm sm:text-base text-text-secondary dark:text-slate-400">
          {t.dashboard.settingsSubtitle}
        </p>
      </div>

      {/* Custom Prompt */}
      <div className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-xl border-2 border-border dark:border-slate-700">
        <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-2">
          {t.dashboard.customPrompt}
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 mb-3 sm:mb-4">
          {t.dashboard.customPromptInstructions}
        </p>
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-primary-soft/50 dark:bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-xs font-semibold text-primary dark:text-primary/80 mb-2">💡 {t.dashboard.customPromptHowItWorks}</p>
          <ul className="text-xs text-text-secondary dark:text-slate-400 space-y-1 ml-3 sm:ml-4 list-disc">
            <li className="break-words">{t.dashboard.customPromptTip1}</li>
            <li className="break-words">{t.dashboard.customPromptTip2}</li>
            <li className="break-words">{t.dashboard.customPromptTip3}</li>
            <li className="break-words">{t.dashboard.customPromptTip4}</li>
          </ul>
        </div>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={8}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-border dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-900 text-text-primary dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder={t.dashboard.customPromptPlaceholder}
        />
        {customPrompt && (
          <div className="mt-3 p-3 bg-[#F8FAF9] dark:bg-slate-900 rounded-lg border border-border dark:border-slate-700">
            <p className="text-xs font-semibold text-text-secondary dark:text-slate-400 mb-1">{t.dashboard.previewLabel}</p>
            <p className="text-xs sm:text-sm text-text-primary dark:text-slate-300 italic break-words whitespace-pre-wrap">"{customPrompt}"</p>
          </div>
        )}
      </div>

      {/* Visual Settings */}
      <div className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-xl border-2 border-border dark:border-slate-700">
        <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-3 sm:mb-4">
          {t.dashboard.visualSettings}
        </h3>
        <div className="space-y-4 sm:space-y-6">
          {/* Color Theme */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary dark:text-white mb-2 sm:mb-3">
              {t.dashboard.colorTheme}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['Verde', 'Azul', 'Púrpura'] as ColorTheme[]).map((theme) => {
                const themeColors: Record<ColorTheme, { bg: string; hover: string; border: string; text: string }> = {
                  Verde: { bg: '#16A34A', hover: '#15803D', border: '#15803D', text: '#FFFFFF' },
                  Azul: { bg: '#2563EB', hover: '#1D4ED8', border: '#1D4ED8', text: '#FFFFFF' },
                  Púrpura: { bg: '#7C3AED', hover: '#6D28D9', border: '#6D28D9', text: '#FFFFFF' },
                };
                const themeLabels: Record<ColorTheme, string> = {
                  Verde: t.dashboard.colorThemeGreen,
                  Azul: t.dashboard.colorThemeBlue,
                  Púrpura: t.dashboard.colorThemePurple,
                };
                const colors = themeColors[theme];
                const isSelected = colorTheme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => setColorTheme(theme)}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-base rounded-lg border-2 transition-all font-medium"
                    style={
                      isSelected
                        ? {
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                            color: colors.text,
                          }
                        : {
                            backgroundColor: 'transparent',
                            borderColor: isDarkMode ? '#475569' : '#E5E7EB',
                            color: isDarkMode ? '#F1F5F9' : '#0F172A',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = colors.border;
                      } else {
                        e.currentTarget.style.backgroundColor = colors.hover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = isDarkMode ? '#475569' : '#E5E7EB';
                      } else {
                        e.currentTarget.style.backgroundColor = colors.bg;
                      }
                    }}
                  >
                    {themeLabels[theme]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary dark:text-white mb-2 sm:mb-3">
              <span className="transition-all duration-400 ease-out">{t.dashboard.fontSize}: </span>
              <span 
                className="font-semibold transition-all duration-400 ease-out inline-block text-sm sm:text-base"
                style={{ transition: 'font-size 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {fontSize}px
              </span>
            </label>
            <input
              type="range"
              min="10"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-border dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-300 ease-out"
            />
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary dark:text-white mb-2 sm:mb-3">
              <span className="transition-all duration-400 ease-out">{t.dashboard.borderRadius}: </span>
              <span 
                className="font-semibold transition-all duration-400 ease-out inline-block text-sm sm:text-base"
                style={{ transition: 'font-size 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {borderRadius}px
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="24"
              value={borderRadius}
              onChange={(e) => setBorderRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-border dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-300 ease-out"
            />
          </div>

          {/* Sound */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 border-border dark:border-slate-700">
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-text-primary dark:text-white mb-1">
                {t.dashboard.soundNotifications}
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
                {t.dashboard.soundNotificationsDesc}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-border dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Response Rules */}
      <div className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-xl border-2 border-border dark:border-slate-700">
        <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-3 sm:mb-4">
          {t.dashboard.responseRules}
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 mb-3 sm:mb-4">
          {t.dashboard.responseRulesDesc}
        </p>
        <div className="bg-[#F8FAF9] dark:bg-slate-900 p-3 sm:p-4 rounded-lg border-2 border-border dark:border-slate-700">
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 text-center py-3 sm:py-4">
            {t.dashboard.responseRulesComingSoon}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
        <button
          onClick={onBackToChat}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-border dark:bg-slate-700 text-text-primary dark:text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-text-secondary/10 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.dashboard.backButton}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t.dashboard.saving}
            </>
          ) : saved ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t.dashboard.saved}
            </>
          ) : (
            t.dashboard.saveChanges
          )}
        </button>
      </div>
    </div>
  );
};

export default AdvancedSettings;
