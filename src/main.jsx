import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppContextProvider } from './components/AppState';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 100,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
      <QueryClientProvider client={reactQueryClient}>
        <App />
      </QueryClientProvider>
    </AppContextProvider>
  </React.StrictMode>,
);
