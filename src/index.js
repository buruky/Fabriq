// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App';

// Clear old localStorage/IndexedDB data (one-time migration)
// IMPORTANT: Comment out this import after first run to avoid clearing data every time
// import './util/clearOldData';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

