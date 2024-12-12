import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// Initialize axios auth header from persisted state
const token = localStorage.getItem('auth-storage')
  ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
  : null;

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);