type AppFooterProps = {
  onOpenSettings: () => void
  onOpenPrivacy: () => void
  onOpenTerms: () => void
}

export function AppFooter({
  onOpenSettings,
  onOpenPrivacy,
  onOpenTerms,
}: AppFooterProps) {
  return (
    <footer className="app-footer">
      <button type="button" className="app-footer__link" onClick={onOpenSettings}>
        設定
      </button>
      <span className="app-footer__sep" aria-hidden="true">
        ·
      </span>
      <button type="button" className="app-footer__link" onClick={onOpenPrivacy}>
        Privacy Policy
      </button>
      <span className="app-footer__sep" aria-hidden="true">
        ·
      </span>
      <button type="button" className="app-footer__link" onClick={onOpenTerms}>
        Terms of Service
      </button>
    </footer>
  )
}
