import { useEffect, useState } from 'react'
import type { TruthRareEvent } from '../rareEvents/types'
import { TRUTH_MESSAGE_INTERVAL_MS } from '../rareEvents/rareEvents'

type TruthEventLoadingViewProps = {
  event: TruthRareEvent
  progress: number
}

export function TruthEventLoadingView({ event, progress }: TruthEventLoadingViewProps) {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLineIndex((prev) => {
        const next = prev + 1
        return next < event.loadingLines.length ? next : prev
      })
    }, TRUTH_MESSAGE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [event.loadingLines.length])

  const message = event.loadingLines[lineIndex] ?? event.loadingLines[0]

  return (
    <div className="view fade-in loading-view truth-loading-view">
      <div className="truth-loading-veil" aria-hidden="true" />
      <div className="loading-content">
        <div className="loading-header">
          <span className="loading-badge truth-event-badge">{event.badge}</span>
          <h2 className="loading-title truth-event-title">{event.title}</h2>
        </div>

        <div className="analysis-message-wrap">
          <p className="analysis-message truth-event-message" key={lineIndex}>
            {message}
          </p>
        </div>

        <div className="progress-wrap">
          <div className="progress-track truth-progress-track">
            <div
              className="progress-fill truth-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-label truth-progress-label">{progress}%</span>
        </div>
      </div>

      <p className="loading-footer truth-loading-footer">沒有笑話。只有一秒鐘的認真。</p>
    </div>
  )
}
