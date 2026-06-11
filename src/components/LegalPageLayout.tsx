import type { ReactNode } from 'react'

type LegalPageLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  onBack: () => void
  footerNote?: string
}

export function LegalPageLayout({
  title,
  subtitle,
  children,
  onBack,
  footerNote,
}: LegalPageLayoutProps) {
  return (
    <div className="view fade-in legal-page">
      <div className="legal-page__card">
        <button type="button" className="legal-page__back scale-button" onClick={onBack}>
          ← 返回
        </button>

        <header className="legal-page__header">
          <p className="legal-page__kicker">AI有點嘴 · LEGAL</p>
          <h1 className="legal-page__title">{title}</h1>
          <p className="legal-page__subtitle">{subtitle}</p>
        </header>

        <div className="legal-page__body">{children}</div>

        {footerNote ? (
          <p className="legal-page__footer-note">{footerNote}</p>
        ) : null}
      </div>
    </div>
  )
}
