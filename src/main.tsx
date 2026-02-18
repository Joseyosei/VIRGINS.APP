import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react'
import App from './App'
import './index.css'

function getProjectId(): string {
  const envId = import.meta.env.VITE_BLINK_PROJECT_ID
  if (envId) return envId
  const hostname = window.location.hostname
  const match = hostname.match(/^([^.]+)\.sites\.blink\.new$/)
  return match ? match[1] : 'virgins-dating-app-s4h0uvdp'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlinkProvider 
      projectId={getProjectId()} 
      publishableKey={import.meta.env.VITE_BLINK_PUBLISHABLE_KEY}
    >
      <BlinkAuthProvider>
        <Toaster position="top-right" />
        <App />
      </BlinkAuthProvider>
    </BlinkProvider>
  </StrictMode>
)
