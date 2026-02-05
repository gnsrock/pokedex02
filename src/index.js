import React from 'react';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css"
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


//direccion Api pokemon
//https://pokeapi.co/docs/v2#pokemon-section
// Deployment trigger 2026-01-22 - Versión: 1.0.2
console.log("Deployment check 2026-01-22 v1.0.2");

// Solución técnica: Limpiar Service Workers y Caché anterior
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Service Worker desregistrado');
    }
  });
}

if ('caches' in window) {
  caches.keys().then(function (names) {
    for (let name of names) {
      caches.delete(name);
      console.log('Caché eliminada:', name);
    }
  });
}

// Recarga forzada opcional si detecta versión vieja (mantenido simple por ahora)
if (localStorage.getItem('app_version') !== '1.0.2') {
  localStorage.setItem('app_version', '1.0.2');
  // window.location.reload(true); // Solo habilitar si es estrictamente necesario
}


