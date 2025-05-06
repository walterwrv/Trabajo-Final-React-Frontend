import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
    
  </React.StrictMode>
);


