import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import UserContext from './UserContext.jsx'; // Ensure UserContext is exported properly
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <App />
  </StrictMode>
);
