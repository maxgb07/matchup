import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';

// Importa la función de registro del Service Worker
import { registerSW } from 'virtual:pwa-register';

// Llama a la función para registrar el Service Worker
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
