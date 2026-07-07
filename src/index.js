import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress WebSocket connection errors from Supabase real-time
const originalError = console.error;
console.error = function (...args) {
  const errorMessage = String(args[0] || '');
  // Suppress WebSocket and real-time errors (non-blocking)
  if (errorMessage.includes('WebSocket') || 
      errorMessage.includes('realtime') ||
      errorMessage.includes('wss://')) {
    return;
  }
  originalError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
