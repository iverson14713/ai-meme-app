import { useEffect, useState } from 'react'
import {
  ULTRA_CRASH_WARNINGS,
  ULTRA_GLITCH_TEXTS,
} from '../rareEvents/rareEvents'

type CrashStage = 'boot' | 'glitch' | 'chaos' | 'reveal'

type RareCrashViewProps = {
  onComplete: () => void
}

export function RareCrashView({ onComplete }: RareCrashViewProps) {
  const [stage, setStage] = useState<CrashStage>('boot')
  const [glitchIndex, setGlitchIndex] = useState(0)
  const [warningIndex, setWarningIndex] = useState(0)
  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    const glitchTimer = window.setInterval(() => {
      setGlitchIndex((i) => (i + 1) % ULTRA_GLITCH_TEXTS.length)
      setWarningIndex((i) => (i + 1) % ULTRA_CRASH_WARNINGS.length)
    }, 180)

    const bootTimer = window.setTimeout(() => setStage('glitch'), 1400)
    const chaosTimer = window.setTimeout(() => setStage('chaos'), 3600)
    const revealTimer = window.setTimeout(() => {
      setStage('reveal')
      setShowFinal(true)
    }, 5200)
    const completeTimer = window.setTimeout(() => onComplete(), 6800)

    return () => {
      window.clearInterval(glitchTimer)
      window.clearTimeout(bootTimer)
      window.clearTimeout(chaosTimer)
      window.clearTimeout(revealTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  const isShaking = stage === 'glitch' || stage === 'chaos'

  return (
    <div
      className={`view rare-crash-view rare-crash-view--${stage} ${isShaking ? 'rare-crash-shake' : ''}`}
    >
      <div className="rare-crash-scanlines" aria-hidden="true" />
      <div className="rare-crash-noise" aria-hidden="true" />

      {stage === 'boot' && (
        <div className="rare-crash-boot fade-in">
          <span className="loading-badge">QUANTUM ANALYSIS v2.0</span>
          <p className="rare-crash-boot-text">正在初始化分析模組...</p>
          <div className="rare-crash-boot-bar">
            <div className="rare-crash-boot-fill" />
          </div>
        </div>
      )}

      {(stage === 'glitch' || stage === 'chaos') && (
        <div className="rare-crash-chaos">
          <div className="rare-crash-warning-bar">
            {ULTRA_CRASH_WARNINGS[warningIndex]}
          </div>

          <div className="rare-crash-glitch-wrap">
            <p className="rare-crash-glitch-text" data-text={ULTRA_GLITCH_TEXTS[glitchIndex]}>
              {ULTRA_GLITCH_TEXTS[glitchIndex]}
            </p>
            <p className="rare-crash-glitch-text rare-crash-glitch-text--offset" aria-hidden="true">
              {ULTRA_GLITCH_TEXTS[(glitchIndex + 2) % ULTRA_GLITCH_TEXTS.length]}
            </p>
          </div>

          <div className="rare-crash-alert">
            <span className="rare-crash-alert-icon">⚠</span>
            <span className="rare-crash-alert-label">AI 崩潰</span>
            <span className="rare-crash-alert-code">0xC0FFEE_DEAD</span>
          </div>

          <div className="rare-crash-log">
            <p>&gt; KERNEL PANIC: life.exe has stopped working</p>
            <p>&gt; DUMPING CORE... ████████░░ 80%</p>
            <p>&gt; ROLLBACK FAILED: 人生無法復原</p>
            <p className="rare-crash-log-corrupt">
              &gt; {ULTRA_GLITCH_TEXTS[glitchIndex]}
            </p>
          </div>
        </div>
      )}

      {showFinal && (
        <div className="rare-crash-final card-appear">
          <span className="rare-ultra-badge">ULTRA RARE // AI CRASH</span>
          <p className="rare-crash-final-text glow-text">「你的人生我真的沒辦法。」</p>
          <p className="rare-crash-final-sub">系統已放棄。但你還得繼續活。</p>
        </div>
      )}
    </div>
  )
}
