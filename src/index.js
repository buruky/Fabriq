// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ✅ Tailwind styles must be imported before App
import App from './App';
import { UserProvider } from './context/UserContext'; // ✅ Your context

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

