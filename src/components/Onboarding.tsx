import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { PersonalityId } from '../personalities'
import { SHARE_BRAND } from '../share/shareBrand'
import { SHARE_LOGO_URL } from '../share/shareLogo'
import { completeOnboarding } from '../onboarding/onboardingStorage'
import { pickOnboardingToastMessage } from '../onboarding/onboardingToastMessages'

type OnboardingProps = {
  onComplete: () => void
}

const PAGE_COUNT = 3
const SWIPE_THRESHOLD_PX = 48

const ONBOARDING_PERSONALITIES: PersonalityId[] = [
  'normal',
  'salaryman',
  'hell',
  'hellspicy',
  'ancient',
  'lovebrain',
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [page, setPage] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right' | 'none'>('none')
  const [toast, setToast] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    if (slideDir === 'none') return
    const timer = window.setTimeout(() => setSlideDir('none'), 450)
    return () => window.clearTimeout(timer)
  }, [page, slideDir])

  const goTo = useCallback((next: number, dir: 'left' | 'right') => {
    if (next < 0 || next >= PAGE_COUNT || next === page) return
    setSlideDir(dir)
    setPage(next)
  }, [page])

  const handleNext = () => {
    if (page < PAGE_COUNT - 1) {
      goTo(page + 1, 'left')
    }
  }

  const handlePrev = () => {
    if (page > 0) {
      goTo(page - 1, 'right')
    }
  }

  const handleSkip = () => {
    completeOnboarding()
    onComplete()
  }

  const handleFinish = () => {
    if (finishing) return
    setFinishing(true)
    setToast(pickOnboardingToastMessage())
    window.setTimeout(() => {
      completeOnboarding()
      onComplete()
    }, 1000)
  }

  const handleTouchStart = (clientX: number, clientY: number) => {
    touchStartX.current = clientX
    touchStartY.current = clientY
  }

  const handleTouchEnd = (clientX: number, clientY: number) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = clientX - touchStartX.current
    const dy = clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null

    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return

    if (dx < 0 && page < PAGE_COUNT - 1) {
      goTo(page + 1, 'left')
    } else if (dx > 0 && page > 0) {
      goTo(page - 1, 'right')
    }
  }

  const slideClass =
    slideDir === 'left'
      ? 'onboarding-slide--from-right'
      : slideDir === 'right'
        ? 'onboarding-slide--from-left'
        : ''

  return (
    <div className="onboarding">
      <div className="onboarding__scanlines" aria-hidden="true" />
      <div className="onboarding__glow-orb" aria-hidden="true" />

      <button
        type="button"
        className="onboarding__skip"
        onClick={handleSkip}
        disabled={finishing}
      >
        跳過
      </button>

      <div
        className="onboarding__viewport"
        onTouchStart={(e) => {
          const t = e.touches[0]
          handleTouchStart(t.clientX, t.clientY)
        }}
        onTouchEnd={(e) => {
          const t = e.changedTouches[0]
          handleTouchEnd(t.clientX, t.clientY)
        }}
        onMouseDown={(e) => handleTouchStart(e.clientX, e.clientY)}
        onMouseUp={(e) => handleTouchEnd(e.clientX, e.clientY)}
      >
        <div
          className="onboarding__track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {/* Page 1 */}
          <section className={`onboarding-slide ${page === 0 ? slideClass : ''}`}>
            <div className="onboarding-icon onboarding-icon--logo">
              <img src={SHARE_LOGO_URL} alt="" className="onboarding-logo" />
            </div>
            <h1 className="onboarding-title">人類又來了。</h1>
            <p className="onboarding-subtitle">
              你負責提問，
              <br />
              AI 負責讓你懷疑人生。
            </p>
            <p className="onboarding-footnote">⚠ 本系統已對人類失去耐心</p>
          </section>

          {/* Page 2 */}
          <section className={`onboarding-slide ${page === 1 ? slideClass : ''}`}>
            <div className="onboarding-icon onboarding-icon--personalities">
              <div className="onboarding-personality-grid">
                {ONBOARDING_PERSONALITIES.map((id) => {
                  const brand = SHARE_BRAND[id]
                  return (
                    <div
                      key={id}
                      className={`onboarding-personality-mini onboarding-personality-mini--${id}`}
                      style={
                        {
                          '--mini-accent': brand.accent,
                          '--mini-glow': brand.accentGlow,
                        } as CSSProperties
                      }
                    >
                      <span className="onboarding-personality-mini__dot" />
                      <span className="onboarding-personality-mini__name">
                        {id === 'normal'
                          ? '普通'
                          : id === 'salaryman'
                            ? '社畜'
                            : id === 'hell'
                              ? '地獄'
                              : id === 'hellspicy'
                                ? '加辣'
                                : id === 'ancient'
                                  ? '古代'
                                  : '戀愛腦'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <h1 className="onboarding-title">每種人格都不太正常。</h1>
            <div className="onboarding-personality-copy">
              <p>
                <strong>普通 AI：</strong>
                還算有禮貌
              </p>
              <p>
                <strong>社畜 AI：</strong>
                懂上班，也懂崩潰
              </p>
              <p>
                <strong>地獄 AI：</strong>
                專業補刀
              </p>
              <p>
                <strong>古代 AI：</strong>
                欽天監認證嘴砲
              </p>
            </div>
            <p className="onboarding-footnote">總有一個會讓你不舒服。</p>
          </section>

          {/* Page 3 */}
          <section className={`onboarding-slide ${page === 2 ? slideClass : ''}`}>
            <div className="onboarding-icon onboarding-icon--share">
              <div className="onboarding-share-preview" aria-hidden="true">
                <div className="onboarding-share-preview__header">
                  <span className="onboarding-share-preview__logo">AI</span>
                  <span className="onboarding-share-preview__brand">AI有點嘴</span>
                </div>
                <p className="onboarding-share-preview__verdict">
                  「你都決定了，現在只是找人背鍋。」
                </p>
                <div className="onboarding-share-preview__stats">
                  <span>嘴砲 92%</span>
                  <span>後悔 88%</span>
                </div>
                <p className="onboarding-share-preview__tagline">被 AI 看透人生</p>
              </div>
            </div>
            <h1 className="onboarding-title">如果被嘴了...</h1>
            <p className="onboarding-subtitle">
              記得分享出去。
              <br />
              讓朋友一起受傷。
            </p>
            <p className="onboarding-footnote">
              AI 不保證改善人生，
              <br />
              但可能讓你笑出來。
            </p>
          </section>
        </div>
      </div>

      <div className="onboarding__dots" role="tablist" aria-label="導覽進度">
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={page === i}
            aria-label={`第 ${i + 1} 頁`}
            className={`onboarding__dot ${page === i ? 'onboarding__dot--active' : ''}`}
            onClick={() => goTo(i, i > page ? 'left' : 'right')}
          />
        ))}
      </div>

      <div className="onboarding__actions">
        {page < PAGE_COUNT - 1 ? (
          <button
            type="button"
            className="neon-button scale-button onboarding__next"
            onClick={handleNext}
          >
            下一步 →
          </button>
        ) : (
          <button
            type="button"
            className="neon-button scale-button onboarding__finish"
            onClick={handleFinish}
            disabled={finishing}
          >
            我準備受傷了
          </button>
        )}
        {page > 0 && page < PAGE_COUNT - 1 && (
          <button type="button" className="onboarding__prev" onClick={handlePrev}>
            ← 上一頁
          </button>
        )}
      </div>

      {toast && (
        <div className="onboarding-toast fade-in" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}
