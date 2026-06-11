import { forwardRef } from 'react'
import type { Personality } from '../personalities'
import type { ReportExtras } from '../reportExtras'
import {
  getShareBrandStyle,
  getShareSiteUrl,
  getTruthShareBrandStyle,
  SHARE_BRAND,
} from '../share/shareBrand'
import type { AnalysisResult } from '../types/analysis'
import { ShareBrandLogo } from './ShareBrandLogo'
import { SharePersonalityStamp } from './SharePersonalityStamp'
import { ShareRadar } from './ShareRadar'

type ShareCardProps = {
  result: AnalysisResult
  report: ReportExtras
  personality: Personality
  variant?: 'normal' | 'rare' | 'ultra' | 'truth'
  rareBadge?: string
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard(
    { result, report, personality, variant = 'normal', rareBadge },
    ref,
  ) {
    const isTruth = variant === 'truth'
    const isAncient = !isTruth && personality.id === 'ancient'
    const brand = SHARE_BRAND[personality.id]
    const siteUrl = getShareSiteUrl()

    const cardClass = [
      'share-card-export',
      isTruth ? 'share-card-export--truth' : `share-card-export--${personality.id}`,
      variant === 'ultra' && 'share-card-export--ultra',
      variant === 'rare' && 'share-card-export--rare',
    ]
      .filter(Boolean)
      .join(' ')

    const cardStyle = isTruth
      ? getTruthShareBrandStyle()
      : getShareBrandStyle(personality.id)

    return (
      <div ref={ref} className={cardClass} style={cardStyle}>
        <div className="share-card-scanlines" aria-hidden="true" />
        {!isTruth && <div className="share-card-grid-bg" aria-hidden="true" />}

        {isAncient && (
          <div className="share-card-imperial-border" aria-hidden="true" />
        )}

        {!isTruth && <SharePersonalityStamp personalityId={personality.id} />}

        {variant === 'rare' || variant === 'ultra' ? (
          <div className="share-card-rare-stamp" aria-hidden="true">
            {variant === 'ultra' ? 'CRASH' : 'RARE'}
          </div>
        ) : null}

        {isTruth && (
          <div className="share-card-truth-stamp" aria-hidden="true">
            TRUTH
          </div>
        )}

        <header className="share-card-header">
          <div className="share-card-brand-row">
            <ShareBrandLogo personalityId={personality.id} muted={isTruth} />
            <div className="share-card-brand-text">
              <p className="share-card-brand-kicker">
                {isTruth
                  ? 'SILENT TRUTH SCAN'
                  : isAncient
                    ? 'IMPERIAL AI DECREE'
                    : 'MEME AI BRAND'}
              </p>
              <h2 className="share-card-logo">AI有點嘴</h2>
              <p className="share-card-personality">{personality.name}</p>
              <span className="share-card-meme-tag">
                {rareBadge ?? (isTruth ? '超真實暴擊' : brand.memeTag)} · #
                {report.reportId.slice(-4)}
              </span>
            </div>
          </div>
        </header>

        <main className={`share-card-main ${isTruth ? 'share-card-main--truth' : ''}`}>
          <span className="share-card-verdict-label">
            {isTruth
              ? 'AI 安靜地說'
              : isAncient
                ? '欽天監聖旨批覆'
                : 'AI 看透你說'}
          </span>
          {isAncient && (
            <p className="share-card-decreet-preamble" aria-hidden="true">
              奉天承運 · 詔曰
            </p>
          )}
          <p className="share-card-verdict">「{result.finalVerdict}」</p>
        </main>

        <footer className="share-card-footer">
          {!isTruth && (
            <>
              <div className="share-card-stats">
                {result.stats.map((stat) => (
                  <div className="share-card-stat" key={stat.label}>
                    <span className="share-card-stat-value">{stat.value}%</span>
                    <span className="share-card-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
              <ShareRadar values={report.radarValues} />
              <p className="share-card-disclaimer">{report.disclaimer}</p>
            </>
          )}

          {isTruth && (
            <p className="share-card-truth-whisper">
              {result.analysis[1] ?? result.analysis[0]}
            </p>
          )}

          <div className="share-card-brand-footer">
            <p className="share-card-tagline">被 AI 看透人生</p>
            <p className="share-card-url">{siteUrl}</p>
          </div>
        </footer>
      </div>
    )
  },
)
