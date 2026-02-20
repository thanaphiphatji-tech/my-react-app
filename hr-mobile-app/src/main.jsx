import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthGate from './AuthGate/AuthGate'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthGate />
  </React.StrictMode>
);

console.log("ENV ALL:", import.meta.env);