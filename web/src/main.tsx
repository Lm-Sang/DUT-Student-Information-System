import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/globals.css';
import '@/app/styles/v2.css';
import '@/app/styles/redesign.css';
import App from '@/app/App';
import { AppProviders } from '@/app/providers/AppProviders';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
