import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// i18n must be imported before any component that uses useTranslation
import './i18n/index.js';
import { ThemeProvider }   from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
