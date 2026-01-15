import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Start with light mode by default
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    console.log('Initial theme check, savedTheme:', savedTheme);
    
    if (savedTheme === 'dark') {
      console.log('Applying dark mode from localStorage');
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      console.log('Applying light mode (default)');
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      // Save light as default if not set
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
    
    console.log('Initial classes:', {
      html: document.documentElement.classList.toString(),
      body: document.body.classList.toString()
    });
  }, []);

  // Apply theme whenever isDarkMode changes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    console.log('Theme changed, isDarkMode:', isDarkMode);
    
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Dark mode applied');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Light mode applied');
    }
    
    console.log('Current classes:', {
      html: root.classList.toString(),
      body: body.classList.toString()
    });
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    console.log('Toggle clicked, current isDarkMode:', isDarkMode);
    setIsDarkMode(prev => {
      console.log('Changing from', prev, 'to', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
