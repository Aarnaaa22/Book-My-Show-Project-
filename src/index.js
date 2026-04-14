// ============================================================
// ENTRY POINT: index.js
// This is where React renders the App into the HTML page.
// The Redux <Provider> is already set up INSIDE App.js,
// so we just render <App /> here — clean and simple.
//
// Note: Provider is in App.js (not here) so that it wraps
// everything including the Router — this is best practice.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ReactDOM.createRoot: React 18 way to mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode: helps catch bugs during development
  // (runs some lifecycle methods twice intentionally)
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
