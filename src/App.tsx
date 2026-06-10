import { useEffect, useState } from 'react'
import {
  LOADING_HOLD_MS,
  LOADING_MESSAGE_INTERVAL_MS,
  LOADING_PROGRESS_MS,
  PERSONALITIES,
  getPersonality,
  pickLoadingMessages,
  type PersonalityId,
} from './loadingMessages'
import { pickResult, type AnalysisResult } from './results'
import { buildReportExtras, type ReportExtras } from './reportExtras'
import { AnimatedNumber } from './components/AnimatedNumber'
import { FakeRadarChart } from './components/FakeRadarChart'

type Phase = 'home' | 'loading' | 'result'

export default function App() {
  const [phase, setPhase] = useState<Phase>('home')
  const [question, setQuestion] = useState('')
  const [personalityId, setPersonalityId] = useState<PersonalityId>('normal')
  const [progress, setProgress] = useState(0)
  const [loadingMessages, setLoadingMessages] = useState<string[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const [isLoadingHold, setIsLoadingHold] = useState(false)
  const [result, setResult] = useState<AnalysisResult>(() =>
    pickResult('', 'normal'),
  )
  const [report, setReport] = useState<ReportExtras>(() =>
    buildReportExtras('normal'),
  )

  const personality = getPersonality(personalityId)

  const startAnalysis = () => {
    if (!question.trim()) return
    setProgress(0)
    setMessageIndex(0)
    setIsLoadingHold(false)
    setLoadingMessages(
      pickLoadingMessages(
        personalityId,
        LOADING_PROGRESS_MS,
        LOADING_MESSAGE_INTERVAL_MS,
      ),
    )
    setResult(pickResult(question.trim(), personalityId))
    setReport(buildReportExtras(personalityId))
    setPhase('loading')
  }

  const resetToHome = () => {
    setPhase('home')
    setProgress(0)
    setMessageIndex(0)
    setIsLoadingHold(false)
    setLoadingMessages([])
  }

  const handleShare = () => {
    // 分享功能待實作
  }

  useEffect(() => {
    if (phase !== 'loading') return

    const tickMs = 50
    const steps = LOADING_PROGRESS_MS / tickMs
    let step = 0
    let resultTimeout: number | undefined

    const messageTimer = window.setInterval(() => {
      setMessageIndex((prev) => {
        const next = prev + 1
        return next < loadingMessages.length ? next : prev
      })
    }, LOADING_MESSAGE_INTERVAL_MS)

    const progressTimer = window.setInterval(() => {
      step += 1
      setProgress(Math.min(99, Math.round((step / steps) * 99)))
    }, tickMs)

    const completeTimer = window.setTimeout(() => {
      window.clearInterval(messageTimer)
      window.clearInterval(progressTimer)
      setProgress(99)
      setIsLoadingHold(true)
      resultTimeout = window.setTimeout(() => setPhase('result'), LOADING_HOLD_MS)
    }, LOADING_PROGRESS_MS)

    return () => {
      window.clearInterval(messageTimer)
      window.clearInterval(progressTimer)
      window.clearTimeout(completeTimer)
      if (resultTimeout !== undefined) window.clearTimeout(resultTimeout)
    }
  }, [phase, loadingMessages])

  const loadingMessage = isLoadingHold
    ? personality.holdMessage
    : (loadingMessages[messageIndex] ?? loadingMessages[0] ?? '')

  return (
    <div className={`app-shell theme-${personalityId}`}>
      {phase === 'home' && (
        <HomeView
          question={question}
          personalityId={personalityId}
          onQuestionChange={setQuestion}
          onPersonalityChange={setPersonalityId}
          onStart={startAnalysis}
        />
      )}
      {phase === 'loading' && (
        <LoadingView
          personality={personality}
          progress={progress}
          message={loadingMessage}
          messageKey={isLoadingHold ? 'hold' : messageIndex}
          isHold={isLoadingHold}
        />
      )}
      {phase === 'result' && (
        <ResultView
          question={question}
          result={result}
          report={report}
          personality={personality}
          onRetry={resetToHome}
          onShare={handleShare}
        />
      )}
    </div>
  )
}

function HomeView({
  question,
  personalityId,
  onQuestionChange,
  onPersonalityChange,
  onStart,
}: {
  question: string
  personalityId: PersonalityId
  onQuestionChange: (value: string) => void
  onPersonalityChange: (id: PersonalityId) => void
  onStart: () => void
}) {
  return (
    <div className="view fade-in">
      <h1 className="glow-title">AI 有點嘴</h1>
      <p className="subtitle">已分析 1,234,567 個失敗人生</p>

      <div className="personality-section">
        <p className="personality-label">選擇 AI 人格</p>
        <div className="personality-grid">
          {PERSONALITIES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`personality-chip scale-button ${personalityId === p.id ? 'personality-chip--active' : ''}`}
              onClick={() => onPersonalityChange(p.id)}
            >
              <span className="personality-chip-name">{p.name}</span>
              <span className="personality-chip-tag">{p.tagline}</span>
            </button>
          ))}
        </div>
      </div>

      <input
        className="question-input"
        placeholder="我要不要離職？"
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onStart()}
      />

      <button
        className="neon-button scale-button"
        onClick={onStart}
        disabled={!question.trim()}
      >
        開始量子分析
      </button>
    </div>
  )
}

function LoadingView({
  personality,
  progress,
  message,
  messageKey,
  isHold,
}: {
  personality: ReturnType<typeof getPersonality>
  progress: number
  message: string
  messageKey: string | number
  isHold: boolean
}) {
  return (
    <div className="view fade-in loading-view">
      <div className="loading-content">
        <div className="loading-header">
          <span className="loading-badge">{personality.loadingBadge}</span>
          <h2 className="glow-title loading-title">{personality.loadingTitle}</h2>
        </div>

        <div className="analysis-message-wrap">
          <p
            className={`analysis-message ${isHold ? 'analysis-message-hold' : 'analysis-message-swap'}`}
            key={messageKey}
          >
            {message}
          </p>
        </div>

        <div className="progress-wrap">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-label glow-text">{progress}%</span>
        </div>
      </div>

      <p className="loading-footer">{personality.loadingFooter}</p>
      <div className="scan-lines" aria-hidden="true" />
    </div>
  )
}

function ResultView({
  question,
  result,
  report,
  personality,
  onRetry,
  onShare,
}: {
  question: string
  result: AnalysisResult
  report: ReportExtras
  personality: ReturnType<typeof getPersonality>
  onRetry: () => void
  onShare: () => void
}) {
  const allStats = [
    ...report.professionalMetrics.map((m) => ({
      label: m.label,
      value: m.value,
    })),
    ...result.stats.map((s) => ({ label: s.label, value: s.value })),
  ]

  return (
    <div className="view fade-in result-view meme-result">
      <article className="meme-card card-appear">
        <p className="meme-question">「{question}」</p>

        <section className="verdict-hero card-appear">
          <div className="verdict-hero-top">
            <span className="verdict-hero-badge">AI 最終判定</span>
            <span className={`danger-badge danger-badge--mini danger-${report.dangerLevel.tone}`}>
              {report.dangerLevel.label}
            </span>
          </div>
          <p className="verdict-hero-text glow-text">「{result.verdict}」</p>
          <p className="verdict-hero-meta">
            {personality.name} · #{report.reportId.slice(-4)}
          </p>
        </section>

        <FakeRadarChart values={report.radarValues} />

        <section className="stats-compact card-appear" style={{ animationDelay: '0.25s' }}>
          <div className="stats-compact-grid">
            {allStats.map((stat, i) => (
              <div className="stat-compact" key={`${stat.label}-${i}`}>
                <AnimatedNumber
                  value={stat.value}
                  duration={900 + i * 80}
                />
                <span className="stat-compact-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </article>

      <div className="result-actions result-actions--meme">
        <button
          className="share-button-primary scale-button"
          onClick={onShare}
        >
          分享這句嘴炮
        </button>
        <button className="retry-button-subtle scale-button" onClick={onRetry}>
          再問一次
        </button>
      </div>

      <p className="meme-disclaimer">{report.disclaimer}</p>
    </div>
  )
}
