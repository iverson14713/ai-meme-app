import { useEffect, useState } from 'react'
import type { CommonRareEvent } from '../rareEvents/types'
import { RARE_MESSAGE_INTERVAL_MS } from '../rareEvents/rareEvents'

type RareEventLoadingViewProps = {
  event: CommonRareEvent
  progress: number
}

export function RareEventLoadingView({ event, progress }: RareEventLoadingViewProps) {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLineIndex((prev) => {
        const next = prev + 1
        return next < event.loadingLines.length ? next : prev
      })
    }, RARE_MESSAGE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [event.loadingLines.length])

  const message = event.loadingLines[lineIndex] ?? event.loadingLines[0]

  return (
    <div className="view fade-in loading-view rare-loading-view">
      <div className="rare-event-shimmer" aria-hidden="true" />
      <div className="loading-content">
        <div className="loading-header">
          <span className="loading-badge rare-event-badge">{event.badge}</span>
          <h2 className="glow-title loading-title rare-event-title">{event.title}</h2>
        </div>

        <div className="analysis-message-wrap">
          <p className="analysis-message analysis-message-swap rare-event-message" key={lineIndex}>
            {message}
          </p>
        </div>

        <div className="progress-wrap">
          <div className="progress-track rare-progress-track">
            <div
              className="progress-fill rare-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-label glow-text rare-progress-label">{progress}%</span>
        </div>
      </div>

      <p className="loading-footer rare-loading-footer">{event.footer}</p>
      <div className="scan-lines" aria-hidden="true" />
    </div>
  )
}
