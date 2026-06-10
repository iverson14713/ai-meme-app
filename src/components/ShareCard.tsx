import { forwardRef } from 'react'
import type { Personality } from '../personalities'
import type { ReportExtras } from '../reportExtras'
import type { AnalysisResult } from '../types/analysis'
import { ShareRadar } from './ShareRadar'

type ShareCardProps = {
  result: AnalysisResult
  report: ReportExtras
  personality: Personality
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ result, report, personality }, ref) {
    const siteLabel =
      typeof window !== 'undefined' && window.location.host
        ? window.location.host
        : 'AI有點嘴'

    return (
      <div ref={ref} className="share-card-export">
        <div className="share-card-scanlines" aria-hidden="true" />

        <header className="share-card-header">
          <div className="share-card-logo-row">
            <img
              className="share-card-icon"
              src="/icon.png"
              alt="AI有點嘴"
            />
            <div>
              <h2 className="share-card-logo">AI有點嘴</h2>
              <p className="share-card-personality">{personality.name}</p>
            </div>
          </div>
          <span className="share-card-badge">OFFICIAL AI REPORT</span>
        </header>

        <main className="share-card-main">
          <span className="share-card-verdict-label">AI 最終判定</span>
          <p className="share-card-verdict">「{result.finalVerdict}」</p>
        </main>

        <footer className="share-card-footer">
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

          <p className="share-card-brand">{siteLabel}</p>
        </footer>
      </div>
    )
  },
)
