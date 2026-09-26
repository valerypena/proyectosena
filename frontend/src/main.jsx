import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { API_URL } from './config'
import './responsive.css'

// Interceptor global de fetch para redirigir peticiones de localhost al API Gateway o Servidor Monolítico en producción
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string' && input.startsWith('http://127.0.0.1:8000')) {
    input = input.replace('http://127.0.0.1:8000', API_URL);
  } else if (input instanceof URL && input.href.startsWith('http://127.0.0.1:8000')) {
    input = new URL(input.href.replace('http://127.0.0.1:8000', API_URL));
  }
  return originalFetch(input, init);
};

// Reemplaza esto con tu Client ID real de Google Cloud Console
const GOOGLE_CLIENT_ID = "TU_GOOGLE_CLIENT_ID_AQUI";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
