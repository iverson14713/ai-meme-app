import { useEffect, type ReactNode } from 'react'

type LegalPageLayoutProps = {
  title: string
  subtitle: string
  documentTitle: string
  children: ReactNode
  backHref?: string
  footerNote?: string
}

export function LegalPageLayout({
  title,
  subtitle,
  documentTitle,
  children,
  backHref = '/',
  footerNote,
}: LegalPageLayoutProps) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = documentTitle
    return () => {
      document.title = previousTitle
    }
  }, [documentTitle])

  return (
    <div className="view fade-in legal-page">
      <div className="legal-page__card">
        <a href={backHref} className="legal-page__back scale-button">
          ← 返回
        </a>

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
