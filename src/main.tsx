import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Prevent auto-scroll to hash on page load
if (window.location.hash) {
  // Remove hash temporarily to prevent auto-scroll
  window.history.replaceState(null, '', window.location.pathname);
}
// Ensure no auto-scroll happens on initial load
document.documentElement.setAttribute('data-scroll-disabled', 'true');
setTimeout(() => {
  // Re-enable smooth scrolling after page load
  document.documentElement.setAttribute('data-scroll-disabled', 'false');
}, 500);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
