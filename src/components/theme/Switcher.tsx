'use client';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'dark' | 'light' | 'system';

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const isTheme = useCallback((t: Theme) => t === theme, [theme]);

  const handleThemeSwitch = (theme: Theme) => {
    setTheme(theme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isTheme('system')) {
      const preferDarkScheme = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );

      const detectThemeChange = (event: MediaQueryListEvent) => {
        const theme: Theme = event.matches ? 'dark' : 'light';
        setTheme(theme);
      };

      preferDarkScheme.addEventListener('change', detectThemeChange);

      return () => {
        preferDarkScheme.removeEventListener('change', detectThemeChange);
      };
    }
  }, [isTheme, setTheme, theme]);

  // Avoid Hydration Mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("glass flex rounded-xl overflow-hidden p-1", className)}>
      <button 
        onClick={() => handleThemeSwitch('light')}
        className={cn(
          "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-300",
          theme === 'light' ? "bg-gradient-to-r from-yellow-400 to-orange-300 text-white shadow-md" : "text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5"
        )}
      >
        <Sun size={16} />
        <span className="text-sm font-medium">Light</span>
      </button>
      <button 
        onClick={() => handleThemeSwitch('dark')}
        className={cn(
          "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-300",
          theme === 'dark' ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md" : "text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5"
        )}
      >
        <Moon size={16} />
        <span className="text-sm font-medium">Dark</span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
