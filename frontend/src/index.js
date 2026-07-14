import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';
import store from './redux/store';
import { Provider } from 'react-redux';

const API_BASE_URL = process.env.REACT_APP_API_URL || ''; // Use relative paths in production by default
const originalFetch = window.fetch.bind(window);

window.fetch = (input, init) => {
  const url =
    typeof input === 'string' && input.startsWith('/api/') && API_BASE_URL
      ? `${API_BASE_URL}${input}`
      : input;

  return originalFetch(url, init);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
);
