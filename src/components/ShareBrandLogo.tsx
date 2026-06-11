import { useEffect, useState } from 'react'
import type { PersonalityId } from '../personalities'
import { getShareLogoDataUrl, SHARE_LOGO_URL } from '../share/shareLogo'

type ShareBrandLogoProps = {
  personalityId: PersonalityId
  muted?: boolean
}

export function ShareBrandLogo({ personalityId, muted = false }: ShareBrandLogoProps) {
  const [logoSrc, setLogoSrc] = useState(SHARE_LOGO_URL)

  useEffect(() => {
    let cancelled = false

    getShareLogoDataUrl()
      .then((dataUrl) => {
        if (!cancelled) setLogoSrc(dataUrl)
      })
      .catch(() => {
        if (!cancelled) setLogoSrc(SHARE_LOGO_URL)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className={`share-brand-logo share-brand-logo--${personalityId} ${muted ? 'share-brand-logo--muted' : ''}`}
    >
      <div className="share-brand-logo__glow" aria-hidden="true" />
      <div className="share-brand-logo__frame">
        <svg
          className="share-brand-logo__brackets"
          viewBox="0 0 72 72"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 20V8h12M52 8h12v12M64 52v12H52M20 64H8V52"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.9" />
          <circle cx="54" cy="54" r="2" fill="currentColor" opacity="0.9" />
        </svg>
        <img
          className="share-brand-logo__icon"
          src={logoSrc}
          alt=""
          data-share-logo="true"
          decoding="sync"
        />
        <div className="share-brand-logo__scanline" aria-hidden="true" />
        <div className="share-brand-logo__eyes" aria-hidden="true">
          <span className="share-brand-logo__eye share-brand-logo__eye--left" />
          <span className="share-brand-logo__eye share-brand-logo__eye--right" />
        </div>
      </div>
    </div>
  )
}
