import React from 'react'
import ReactDOM from 'react-dom/client'
import { onLCP, onFCP, onTTFB, Metric } from 'web-vitals';
import App from './App.tsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


function sendToAnalytics(metric: Metric) {
  // Replace with whatever serialization method you prefer.
  // Note: JSON.stringify will likely include more data than you need.
  const body = JSON.stringify({ name: metric.name, value: metric.value });

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  try {
    (navigator.sendBeacon && navigator.sendBeacon('/api/writeVitals', body)) ||
      fetch('/api/writeVitals', { body, method: 'POST', keepalive: true });
  } catch (error) {
    console.log('error', error)
  }

}

// onTTFB(sendToAnalytics)
// onFCP(sendToAnalytics)
// onLCP(sendToAnalytics);

setInterval(() => {
  sendToAnalytics({ name: 'LCP', value: Math.random() * 100 + 1000 } as any)
  sendToAnalytics({ name: 'FCP', value: Math.random() * 100 + 600 } as any)
  sendToAnalytics({ name: 'TTFB', value: Math.random() * 100 + 200 } as any)
}, 1000)