
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';
import { dbService } from '../services/db';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_DEFINITIONS: Record<Theme, any> = {
  light: {
    background: '#F5F0E8', surface: '#FFFFFF', 'surface-2': '#FAF6EF', 
    foreground: '#1A1A1A', muted: 'rgba(26, 26, 26, 0.68)', border: 'rgba(20, 20, 20, 0.10)', 
    accent: '#B8923B', 'accent-2': '#D6C08B'
  },
  dark: {
    background: '#0B0D10', surface: '#121722', 'surface-2': '#161C28', 
    foreground: '#F2F2EF', muted: 'rgba(242, 242, 239, 0.72)', border: 'rgba(255, 255, 255, 0.08)', 
    accent: '#C9A24A', 'accent-2': '#E3D4A6'
  },
  obsidian: {
    background: '#050505', surface: '#0A0A0A', 'surface-2': '#111111', 
    foreground: '#E5E5E5', muted: 'rgba(229, 229, 229, 0.5)', border: 'rgba(255, 255, 255, 0.1)', 
    accent: '#9C7B2E', 'accent-2': '#B8923B'
  },
  champagne: {
    background: '#FDFCF0', surface: '#FFFFFF', 'surface-2': '#F9F7E8', 
    foreground: '#2D2926', muted: 'rgba(45, 41, 38, 0.6)', border: 'rgba(45, 41, 38, 0.08)', 
    accent: '#A68D7B', 'accent-2': '#C6B09D'
  },
  marble: {
    background: '#F7F7F7', surface: '#FFFFFF', 'surface-2': '#EEEEEE', 
    foreground: '#111111', muted: 'rgba(0, 0, 0, 0.6)', border: 'rgba(0, 0, 0, 0.1)', 
    accent: '#333333', 'accent-2': '#666666'
  },
  navy: {
    background: '#0A1128', surface: '#121E41', 'surface-2': '#16254E', 
    foreground: '#FFFFFF', muted: 'rgba(255, 255, 255, 0.6)', border: 'rgba(255, 255, 255, 0.1)', 
    accent: '#B08D57', 'accent-2': '#D4AF37'
  },
  emerald: {
    background: '#062C21', surface: '#0A3D2E', 'surface-2': '#0D4D3B', 
    foreground: '#E0E7E1', muted: 'rgba(224, 231, 225, 0.6)', border: 'rgba(255, 255, 255, 0.08)', 
    accent: '#CD7F32', 'accent-2': '#E5B78A'
  },
  desert: {
    background: '#EAE2D6', surface: '#F4EFE6', 'surface-2': '#DED3C1', 
    foreground: '#4A3728', muted: 'rgba(74, 55, 40, 0.6)', border: 'rgba(74, 55, 40, 0.1)', 
    accent: '#A0522D', 'accent-2': '#BC8F8F'
  },
  industrial: {
    background: '#2B2D2F', surface: '#36393C', 'surface-2': '#1E2022', 
    foreground: '#D1D1D1', muted: 'rgba(209, 209, 209, 0.5)', border: 'rgba(255, 255, 255, 0.05)', 
    accent: '#E67E22', 'accent-2': '#D35400'
  },
  nordic: {
    background: '#F0F4F7', surface: '#FFFFFF', 'surface-2': '#E5E9EC', 
    foreground: '#2C3E50', muted: 'rgba(44, 62, 80, 0.6)', border: 'rgba(44, 62, 80, 0.08)', 
    accent: '#34495E', 'accent-2': '#7F8C8D'
  },
  rose: {
    background: '#FFF5F5', surface: '#FFFFFF', 'surface-2': '#FFF0F0', 
    foreground: '#5D4037', muted: 'rgba(93, 64, 55, 0.6)', border: 'rgba(93, 64, 55, 0.1)', 
    accent: '#E5989B', 'accent-2': '#FFB7B2'
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    dbService.getSettings().then(s => {
      setTheme(s.activeTheme || 'dark');
    });
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const colors = THEME_DEFINITIONS[theme];
    
    if (!colors) return;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });

    if (['dark', 'obsidian', 'navy', 'emerald', 'industrial'].includes(theme)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
