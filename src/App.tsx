import { useCallback, useEffect, useRef, useState } from 'react'
import {
  LOADING_HOLD_MS,
  LOADING_MESSAGE_INTERVAL_MS,
  LOADING_PROGRESS_MS,
  PERSONALITIES,
  getPersonality,
  pickLoadingMessages,
  type PersonalityId,
} from './loadingMessages'
import { pickResult } from './results'
import { fetchAnalysis } from './services/fetchAnalysis'
import { buildReportExtras, type ReportExtras } from './reportExtras'
import type { AnalysisResult } from './types/analysis'
import { AnimatedNumber } from './components/AnimatedNumber'
import { FakeRadarChart } from './components/FakeRadarChart'
import { ShareCard } from './components/ShareCard'
import { RareCrashView } from './components/RareCrashView'
import { RareEventLoadingView } from './components/RareEventLoadingView'
import { RareEventResultView } from './components/RareEventResultView'
import { UpgradeModal } from './components/UpgradeModal'
import {
  buildCommonRareResult,
  buildUltraRareResult,
  forceRareEvent,
  RARE_LOADING_MS,
  rollRareEvent,
} from './rareEvents/rareEvents'
import type { ActiveRareEvent } from './rareEvents/types'
import { downloadShareImage, generateShareImage } from './utils/shareImage'
import {
  consumeUsage,
  isPersonalityUnlocked,
  loadUsageSnapshot,
  setProMode,
  toggleProMode,
  type UsageSnapshot,
} from './usage/planLimits'

type Phase =
  | 'home'
  | 'loading'
  | 'result'
  | 'rare-loading'
  | 'rare-crash'
  | 'rare-result'

export default function App() {
  const [phase, setPhase] = useState<Phase>('home')
  const [question, setQuestion] = useState('')
  const [personalityId, setPersonalityId] = useState<PersonalityId>('normal')
  const [progress, setProgress] = useState(0)
  const [loadingMessages, setLoadingMessages] = useState<string[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const [isLoadingHold, setIsLoadingHold] = useState(false)
  const [loadingAnimationDone, setLoadingAnimationDone] = useState(false)
  const [pendingResult, setPendingResult] = useState<AnalysisResult | null>(null)
  const [result, setResult] = useState<AnalysisResult>(() =>
    pickResult('', 'normal'),
  )
  const [report, setReport] = useState<ReportExtras>(() =>
    buildReportExtras('normal'),
  )
  const analysisSessionRef = useRef(0)
  const [usage, setUsage] = useState<UsageSnapshot>(() => loadUsageSnapshot())
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [upgradeVariant, setUpgradeVariant] = useState<'limit' | 'personality'>(
    'limit',
  )
  const [activeRare, setActiveRare] = useState<ActiveRareEvent | null>(null)
  const [rareProgress, setRareProgress] = useState(0)
  const [debugForceRare, setDebugForceRare] = useState<'common' | 'ultra' | null>(
    null,
  )

  const personality = getPersonality(personalityId)

  useEffect(() => {
    setUsage(loadUsageSnapshot())
  }, [])

  const openUpgrade = (variant: 'limit' | 'personality') => {
    setUpgradeVariant(variant)
    setUpgradeOpen(true)
  }

  const handlePersonalityChange = (id: PersonalityId) => {
    if (!isPersonalityUnlocked(id, usage.isPro)) {
      openUpgrade('personality')
      return
    }
    setPersonalityId(id)
  }

  const handleTogglePro = () => {
    setUsage(toggleProMode())
  }

  const handleFakeUpgrade = () => {
    setUsage(setProMode(true))
    setUpgradeOpen(false)
  }

  const handleArmRare = (tier: 'common' | 'ultra') => {
    setDebugForceRare((prev) => (prev === tier ? null : tier))
  }

  const beginRareFlow = (rareRoll: ActiveRareEvent) => {
    analysisSessionRef.current += 1
    setActiveRare(rareRoll)
    setReport(buildReportExtras(personalityId))
    setRareProgress(0)
    setPendingResult(null)

    if (rareRoll.tier === 'ultra') {
      setPhase('rare-crash')
    } else {
      setPhase('rare-loading')
    }
  }

  const startAnalysis = () => {
    const trimmed = question.trim()
    if (!trimmed) return

    const snapshot = loadUsageSnapshot()
    setUsage(snapshot)

    if (!isPersonalityUnlocked(personalityId, snapshot.isPro)) {
      openUpgrade('personality')
      return
    }

    if (snapshot.remaining <= 0) {
      openUpgrade('limit')
      return
    }

    setUsage(consumeUsage())

    const forcedRare = debugForceRare
    if (forcedRare) setDebugForceRare(null)

    const rareRoll = forcedRare
      ? forceRareEvent(forcedRare)
      : rollRareEvent()

    if (rareRoll) {
      beginRareFlow(rareRoll)
      return
    }

    const session = analysisSessionRef.current + 1
    analysisSessionRef.current = session

    setProgress(0)
    setMessageIndex(0)
    setIsLoadingHold(false)
    setLoadingAnimationDone(false)
    setPendingResult(null)
    setActiveRare(null)
    setLoadingMessages(
      pickLoadingMessages(
        personalityId,
        LOADING_PROGRESS_MS,
        LOADING_MESSAGE_INTERVAL_MS,
      ),
    )
    setReport(buildReportExtras(personalityId))
    setPhase('loading')

    fetchAnalysis(trimmed, personalityId).then((analysisResult) => {
      if (analysisSessionRef.current !== session) return
      setPendingResult(analysisResult)
    })
  }

  const handleRareCrashComplete = useCallback(() => {
    setResult(buildUltraRareResult())
    setPhase('rare-result')
  }, [])

  const resetToHome = () => {
    analysisSessionRef.current += 1
    setPhase('home')
    setProgress(0)
    setMessageIndex(0)
    setIsLoadingHold(false)
    setLoadingAnimationDone(false)
    setPendingResult(null)
    setLoadingMessages([])
    setActiveRare(null)
    setRareProgress(0)
    setUsage(loadUsageSnapshot())
  }

  useEffect(() => {
    if (phase !== 'loading') return

    const tickMs = 50
    const steps = LOADING_PROGRESS_MS / tickMs
    let step = 0
    let holdTimeout: number | undefined

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
      holdTimeout = window.setTimeout(
        () => setLoadingAnimationDone(true),
        LOADING_HOLD_MS,
      )
    }, LOADING_PROGRESS_MS)

    return () => {
      window.clearInterval(messageTimer)
      window.clearInterval(progressTimer)
      window.clearTimeout(completeTimer)
      if (holdTimeout !== undefined) window.clearTimeout(holdTimeout)
    }
  }, [phase, loadingMessages])

  useEffect(() => {
    if (phase !== 'rare-loading' || !activeRare || activeRare.tier !== 'common') {
      return
    }

    const tickMs = 50
    const steps = RARE_LOADING_MS / tickMs
    let step = 0

    const progressTimer = window.setInterval(() => {
      step += 1
      setRareProgress(Math.min(99, Math.round((step / steps) * 99)))
    }, tickMs)

    const completeTimer = window.setTimeout(() => {
      window.clearInterval(progressTimer)
      setRareProgress(99)
      setResult(buildCommonRareResult(activeRare.event))
      setPhase('rare-result')
    }, RARE_LOADING_MS)

    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(completeTimer)
    }
  }, [phase, activeRare])

  useEffect(() => {
    if (phase !== 'loading' || !loadingAnimationDone || !pendingResult) return
    setResult(pendingResult)
    setPhase('result')
  }, [phase, loadingAnimationDone, pendingResult])

  const waitingForApi = isLoadingHold && !pendingResult
  const loadingMessage = waitingForApi
    ? 'AI 正在同步量子結論...'
    : isLoadingHold
      ? personality.holdMessage
      : (loadingMessages[messageIndex] ?? loadingMessages[0] ?? '')

  const shellClass =
    phase === 'rare-crash'
      ? 'app-shell theme-rare-crash'
      : `app-shell theme-${personalityId}`

  return (
    <div className={shellClass}>
      <UpgradeModal
        open={upgradeOpen}
        variant={upgradeVariant}
        onClose={() => setUpgradeOpen(false)}
        onUpgrade={handleFakeUpgrade}
      />
      {phase === 'home' && (
        <HomeView
          question={question}
          personalityId={personalityId}
          usage={usage}
          onQuestionChange={setQuestion}
          onPersonalityChange={handlePersonalityChange}
          onStart={startAnalysis}
          onTogglePro={handleTogglePro}
          debugForceRare={debugForceRare}
          onArmRare={handleArmRare}
        />
      )}
      {phase === 'loading' && (
        <LoadingView
          personality={personality}
          progress={progress}
          message={loadingMessage}
          messageKey={waitingForApi ? 'api-wait' : isLoadingHold ? 'hold' : messageIndex}
          isHold={isLoadingHold || waitingForApi}
        />
      )}
      {phase === 'rare-loading' && activeRare?.tier === 'common' && (
        <RareEventLoadingView event={activeRare.event} progress={rareProgress} />
      )}
      {phase === 'rare-crash' && (
        <RareCrashView onComplete={handleRareCrashComplete} />
      )}
      {phase === 'rare-result' && activeRare && (
        <RareEventResultView
          question={question}
          result={result}
          report={report}
          personality={personality}
          activeRare={activeRare}
          onRetry={resetToHome}
        />
      )}
      {phase === 'result' && (
        <ResultView
          question={question}
          result={result}
          report={report}
          personality={personality}
          onRetry={resetToHome}
        />
      )}
    </div>
  )
}

function HomeView({
  question,
  personalityId,
  usage,
  onQuestionChange,
  onPersonalityChange,
  onStart,
  onTogglePro,
  debugForceRare,
  onArmRare,
}: {
  question: string
  personalityId: PersonalityId
  usage: UsageSnapshot
  onQuestionChange: (value: string) => void
  onPersonalityChange: (id: PersonalityId) => void
  onStart: () => void
  onTogglePro: () => void
  debugForceRare: 'common' | 'ultra' | null
  onArmRare: (tier: 'common' | 'ultra') => void
}) {
  const planLabel = usage.isPro ? 'PRO' : 'Free'

  return (
    <div className="view fade-in">
      <img className="app-icon" src="/icon.png" alt="AI有點嘴" />
      <h1 className="glow-title">AI 有點嘴</h1>
      <p className="subtitle">已分析 1,234,567 個失敗人生</p>

      <div className="usage-bar">
        <span className={`usage-plan-badge ${usage.isPro ? 'usage-plan-badge--pro' : ''}`}>
          {planLabel}
        </span>
        <span className="usage-remaining">
          今日剩餘：<strong>{usage.remaining}</strong> / {usage.dailyLimit}
        </span>
      </div>

      <div className="personality-section">
        <p className="personality-label">選擇 AI 人格</p>
        <div className="personality-grid">
          {PERSONALITIES.map((p) => {
            const locked = !isPersonalityUnlocked(p.id, usage.isPro)
            return (
              <button
                key={p.id}
                type="button"
                className={`personality-chip scale-button ${personalityId === p.id ? 'personality-chip--active' : ''} ${locked ? 'personality-chip--locked' : ''}`}
                onClick={() => onPersonalityChange(p.id)}
                aria-disabled={locked}
              >
                {locked && <span className="personality-lock-icon" aria-hidden="true">🔒</span>}
                <span className="personality-chip-name">{p.name}</span>
                <span className="personality-chip-tag">
                  {locked ? 'PRO 解鎖' : p.tagline}
                </span>
              </button>
            )
          })}
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

      <div className="debug-panel">
        <p className="debug-panel-label">DEBUG</p>
        <button type="button" className="debug-pro-toggle" onClick={onTogglePro}>
          切換 PRO 模式
        </button>
        <button
          type="button"
          className={`debug-pro-toggle ${debugForceRare === 'common' ? 'debug-pro-toggle--active' : ''}`}
          onClick={() => onArmRare('common')}
        >
          {debugForceRare === 'common' ? '✓ 下次：強制稀有事件' : '強制稀有事件'}
        </button>
        <button
          type="button"
          className={`debug-pro-toggle ${debugForceRare === 'ultra' ? 'debug-pro-toggle--active' : ''}`}
          onClick={() => onArmRare('ultra')}
        >
          {debugForceRare === 'ultra' ? '✓ 下次：強制 AI 崩潰' : '強制 AI 崩潰'}
        </button>
        {debugForceRare && (
          <p className="debug-armed-hint">
            已武裝：下次「開始量子分析」將觸發
            {debugForceRare === 'ultra' ? ' AI 崩潰' : ' 稀有事件'}
          </p>
        )}
      </div>
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
}: {
  question: string
  result: AnalysisResult
  report: ReportExtras
  personality: ReturnType<typeof getPersonality>
  onRetry: () => void
}) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareError, setShareError] = useState('')

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
    <div className="view fade-in result-view meme-result">
      <p className="share-section-label">分享卡預覽 · IG 限動比例</p>

      <div className="share-card-preview-wrap">
        <ShareCard
          ref={shareCardRef}
          result={result}
          report={report}
          personality={personality}
        />
      </div>

      {shareImageUrl && (
        <div className="share-image-preview fade-in">
          <img src={shareImageUrl} alt="AI有點嘴分享圖預覽" />
        </div>
      )}

      {shareError && <p className="share-error">{shareError}</p>}

      <div className="result-actions result-actions--meme">
        <button
          className="share-button-primary scale-button"
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

      <details className="result-details">
        <summary>查看完整分析</summary>
        <article className="meme-card card-appear">
          <p className="meme-question">「{question}」</p>

          <ul className="analysis-lines card-appear">
            {result.analysis.map((line, i) => (
              <li key={`${line}-${i}`} style={{ animationDelay: `${0.05 * i}s` }}>
                {line}
              </li>
            ))}
          </ul>

          <section className="verdict-hero card-appear">
            <div className="verdict-hero-top">
              <span className="verdict-hero-badge">AI 最終判定</span>
              <span className={`danger-badge danger-badge--mini danger-${report.dangerLevel.tone}`}>
                {report.dangerLevel.label}
              </span>
            </div>
            <p className="verdict-hero-text glow-text">「{result.finalVerdict}」</p>
            <p className="verdict-hero-meta">
              {personality.name} · #{report.reportId.slice(-4)}
              {result.source === 'fallback' ? ' · 離線模式' : ''}
            </p>
          </section>

          <FakeRadarChart values={report.radarValues} />

          <section className="stats-compact card-appear" style={{ animationDelay: '0.25s' }}>
            <div className="stats-compact-grid stats-compact-grid--three">
              {result.stats.map((stat, i) => (
                <div className="stat-compact" key={`${stat.label}-${i}`}>
                  <AnimatedNumber value={stat.value} duration={900 + i * 80} />
                  <span className="stat-compact-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </section>
        </article>
      </details>
    </div>
  )
}
