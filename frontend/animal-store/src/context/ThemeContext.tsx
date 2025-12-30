import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

// Catppuccin Mocha Color Palette
const catppuccin = {
  rosewater: '#f5e0dc',
  flamingo: '#f2cdcd',
  pink: '#f5c2e7',
  mauve: '#cba6f7',
  red: '#f38ba8',
  maroon: '#eba0ac',
  peach: '#fab387',
  yellow: '#f9e2af',
  green: '#a6e3a1',
  teal: '#94e2d5',
  sky: '#89dceb',
  sapphire: '#74c7ec',
  blue: '#89b4fa',
  lavender: '#b4befe',
  text: '#cdd6f4',
  subtext1: '#bac2de',
  subtext0: '#a6adc8',
  overlay2: '#9399b2',
  overlay1: '#7f849c',
  overlay0: '#6c7086',
  surface2: '#585b70',
  surface1: '#45475a',
  surface0: '#313244',
  base: '#1e1e2e',
  mantle: '#181825',
  crust: '#11111b',
};

export { catppuccin };

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme') as ThemeMode | null;
    const initialMode = savedMode || 'dark'; // Default to dark mode for Catppuccin

    // Set initial body class to prevent flash
    if (initialMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    return initialMode;
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);

    // Add/remove dark-mode class on body for CSS styling
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Apply theme to document
    if (mode === 'dark') {
      // Catppuccin Mocha theme
      document.documentElement.style.setProperty('--bg-color', catppuccin.base);
      document.documentElement.style.setProperty('--bg-secondary', catppuccin.mantle);
      document.documentElement.style.setProperty('--card-bg', catppuccin.surface0);
      document.documentElement.style.setProperty('--card-hover', catppuccin.surface1);
      document.documentElement.style.setProperty('--text-color', catppuccin.text);
      document.documentElement.style.setProperty('--text-secondary', catppuccin.subtext0);
      document.documentElement.style.setProperty('--border-color', catppuccin.surface1);
      document.documentElement.style.setProperty('--accent-color', catppuccin.green);
      document.documentElement.style.setProperty('--accent-hover', catppuccin.teal);
      document.documentElement.style.setProperty('--primary-color', catppuccin.blue);
      document.documentElement.style.setProperty('--danger-color', catppuccin.red);
      document.documentElement.style.setProperty('--warning-color', catppuccin.peach);
      document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
    } else {
      // Light theme (keep original colors)
      document.documentElement.style.setProperty('--bg-color', '#f5f5f5');
      document.documentElement.style.setProperty('--bg-secondary', '#e8e8e8');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--card-hover', '#fafafa');
      document.documentElement.style.setProperty('--text-color', '#000000');
      document.documentElement.style.setProperty('--text-secondary', '#8c8c8c');
      document.documentElement.style.setProperty('--border-color', '#d9d9d9');
      document.documentElement.style.setProperty('--accent-color', '#52c41a');
      document.documentElement.style.setProperty('--accent-hover', '#73d13d');
      document.documentElement.style.setProperty('--primary-color', '#1890ff');
      document.documentElement.style.setProperty('--danger-color', '#ff4d4f');
      document.documentElement.style.setProperty('--warning-color', '#faad14');
      document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
