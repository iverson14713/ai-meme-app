import { getPrivacyPath, getTermsPath } from '../routing/legalPaths'

type AppFooterProps = {
  onOpenSettings: () => void
}

export function AppFooter({ onOpenSettings }: AppFooterProps) {
  return (
    <footer className="app-footer">
      <button type="button" className="app-footer__link" onClick={onOpenSettings}>
        設定
      </button>
      <span className="app-footer__sep" aria-hidden="true">
        ·
      </span>
      <a className="app-footer__link" href={getPrivacyPath()}>
        Privacy Policy
      </a>
      <span className="app-footer__sep" aria-hidden="true">
        ·
      </span>
      <a className="app-footer__link" href={getTermsPath()}>
        Terms of Service
      </a>
    </footer>
  )
}
