import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'ec-theme'; // 'light' | 'dark' | 'system'

const ThemeContext = createContext(null);

function resolveTheme(preference) {
  if (preference === 'dark')  return 'dark';
  if (preference === 'light') return 'light';
  // system
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved) {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'system'
  );

  const resolved = resolveTheme(preference);

  // Apply on mount and whenever preference changes
  useEffect(() => {
    applyTheme(resolved);
    localStorage.setItem(STORAGE_KEY, preference);
  }, [preference, resolved]);

  // Track OS changes when preference === 'system'
  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme(resolveTheme('system'));
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  return (
    <ThemeContext.Provider value={{ preference, setPreference, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
