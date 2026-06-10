import { useRef, useState } from 'react'
import type { Personality } from '../personalities'
import type { ReportExtras } from '../reportExtras'
import type { AnalysisResult } from '../types/analysis'
import type { ActiveRareEvent } from '../rareEvents/types'
import { downloadShareImage, generateShareImage } from '../utils/shareImage'
import { AnimatedNumber } from './AnimatedNumber'
import { ShareCard } from './ShareCard'

type RareEventResultViewProps = {
  question: string
  result: AnalysisResult
  report: ReportExtras
  personality: Personality
  activeRare: ActiveRareEvent
  onRetry: () => void
}

export function RareEventResultView({
  question,
  result,
  report,
  personality,
  activeRare,
  onRetry,
}: RareEventResultViewProps) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareError, setShareError] = useState('')

  const isUltra = activeRare.tier === 'ultra'
  const rareBadge =
    activeRare.tier === 'common' ? activeRare.event.badge : 'ULTRA RARE // AI CRASH'

  const handleGenerateShare = async () => {
    if (!shareCardRef.current) return
    setIsGenerating(true)
    setShareError('')
    try {
      const url = await generateShareImage(shareCardRef.current)
      setShareImageUrl(url)
    } catch {
      setShareError('生成失敗，請再試一次')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadShare = () => {
    if (!shareImageUrl) return
    downloadShareImage(shareImageUrl)
  }

  return (
    <div
      className={`view fade-in result-view meme-result rare-result-view ${isUltra ? 'rare-result-view--ultra' : 'rare-result-view--common'}`}
    >
      <div className="rare-result-glow" aria-hidden="true" />

      <p className="share-section-label">
        {isUltra ? '⚠ 系統崩潰報告 · 超稀有' : '✦ 稀有事件 · 限時截圖'}
      </p>

      <div className="share-card-preview-wrap">
        <ShareCard
          ref={shareCardRef}
          result={result}
          report={report}
          personality={personality}
          variant={isUltra ? 'ultra' : 'rare'}
          rareBadge={rareBadge}
        />
      </div>

      {shareImageUrl && (
        <div className="share-image-preview fade-in">
          <img src={shareImageUrl} alt="AI有點嘴稀有事件分享圖" />
        </div>
      )}

      {shareError && <p className="share-error">{shareError}</p>}

      <div className="result-actions result-actions--meme">
        <button
          className="share-button-primary scale-button rare-share-button"
          onClick={handleGenerateShare}
          disabled={isGenerating}
        >
          {isGenerating ? '生成中...' : '生成分享圖'}
        </button>
        <button
          className="download-button scale-button"
          onClick={handleDownloadShare}
          disabled={!shareImageUrl}
        >
          下載圖片
        </button>
        <button className="retry-button-subtle scale-button" onClick={onRetry}>
          再問一次
        </button>
      </div>

      <article className={`meme-card card-appear rare-meme-card ${isUltra ? 'rare-meme-card--ultra' : ''}`}>
        <span className="rare-event-result-badge">{rareBadge}</span>
        <p className="meme-question rare-meme-question">「{question}」</p>

        <ul className="analysis-lines card-appear rare-analysis-lines">
          {result.analysis.map((line, i) => (
            <li key={`${line}-${i}`} style={{ animationDelay: `${0.08 * i}s` }}>
              {line}
            </li>
          ))}
        </ul>

        <section className="verdict-hero card-appear rare-verdict-hero">
          <div className="verdict-hero-top">
            <span className="verdict-hero-badge">
              {isUltra ? 'AI 崩潰判定' : '稀有事件判定'}
            </span>
            <span className="danger-badge danger-badge--mini danger-giveup">
              {isUltra ? '系統放棄' : '非正常輸出'}
            </span>
          </div>
          <p className="verdict-hero-text glow-text rare-verdict-text">
            「{result.finalVerdict}」
          </p>
          <p className="verdict-hero-meta">
            {personality.name} · #{report.reportId.slice(-4)} · 稀有事件
          </p>
        </section>

        <section className="stats-compact card-appear" style={{ animationDelay: '0.25s' }}>
          <div className="stats-compact-grid stats-compact-grid--three">
            {result.stats.map((stat, i) => (
              <div className="stat-compact rare-stat-compact" key={`${stat.label}-${i}`}>
                <AnimatedNumber value={stat.value} duration={900 + i * 80} />
                <span className="stat-compact-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
