import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserPreferences } from '../types';
import { auth } from '../services/googleAuthService';
import { updateUserPreferences } from '../services/firestoreService';

interface ThemeContextType {
  theme: UserPreferences['theme'];
  fontSize: UserPreferences['fontSize'];
  setTheme: (theme: UserPreferences['theme']) => void;
  setFontSize: (size: UserPreferences['fontSize']) => void;
  hydratePreferences: (prefs: UserPreferences) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<UserPreferences['theme']>(() => {
    try {
      const saved = localStorage.getItem('mix_theme_v2') as UserPreferences['theme'];
      if (['light', 'charcoal', 'midnight', 'sunset', 'neon', 'emerald'].includes(saved)) {
        return saved;
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  const [fontSize, setFontSizeState] = useState<UserPreferences['fontSize']>(() => {
    try {
      return (localStorage.getItem('fontSize') as UserPreferences['fontSize']) || 'medium';
    } catch {
      return 'medium';
    }
  });

  const hydratePreferences = useCallback((prefs: UserPreferences) => {
    if (prefs.theme) {
      setThemeState(prefs.theme);
      try {
        localStorage.setItem('mix_theme_v2', prefs.theme);
      } catch {}
    }
    if (prefs.fontSize) {
      setFontSizeState(prefs.fontSize);
      try {
        localStorage.setItem('fontSize', prefs.fontSize);
      } catch {}
    }
  }, []);

  const setTheme = (newTheme: UserPreferences['theme']) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('mix_theme_v2', newTheme);
    } catch {}
    if (auth.currentUser) {
      void updateUserPreferences(auth.currentUser.uid, { theme: newTheme }).catch((err) => {
        console.error('Failed to sync theme preference:', err);
      });
    }
  };

  const setFontSize = (newSize: UserPreferences['fontSize']) => {
    setFontSizeState(newSize);
    try {
      localStorage.setItem('fontSize', newSize);
    } catch {}
    if (auth.currentUser) {
      void updateUserPreferences(auth.currentUser.uid, { fontSize: newSize }).catch((err) => {
        console.error('Failed to sync fontSize preference:', err);
      });
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-emerald', 'theme-midnight', 'theme-sunset', 'theme-neon', 'theme-charcoal');
    root.classList.add(`theme-${theme}`);
    document.body.classList.remove('theme-light', 'theme-emerald', 'theme-midnight', 'theme-sunset', 'theme-neon', 'theme-charcoal');
    document.body.classList.add(`theme-${theme}`);

    root.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
  }, [theme, fontSize]);

  return (
    <ThemeContext.Provider value={{ theme, fontSize, setTheme, setFontSize, hydratePreferences }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
