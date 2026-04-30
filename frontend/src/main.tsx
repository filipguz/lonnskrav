import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import App, { AppWithAuth } from './App.tsx'
import Vedlikehold from './Vedlikehold.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const MAINTENANCE = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {MAINTENANCE ? (
      <Vedlikehold />
    ) : PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <AppWithAuth />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
