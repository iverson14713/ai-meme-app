import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsOfServicePage } from './pages/TermsOfServicePage'
import { getLegalPageFromPath } from './routing/legalPaths'
import { preloadShareLogo } from './share/shareLogo'

preloadShareLogo()

function Root() {
  const legalPage = getLegalPageFromPath(window.location.pathname)

  if (legalPage === 'privacy') {
    return <PrivacyPolicyPage />
  }

  if (legalPage === 'terms') {
    return <TermsOfServicePage />
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
