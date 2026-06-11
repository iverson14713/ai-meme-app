import type { UsageSnapshot } from '../usage/planLimits'

type SettingsPageProps = {
  usage: UsageSnapshot
  onBack: () => void
  onOpenPrivacy: () => void
  onOpenTerms: () => void
  onTogglePro: () => void
}

export function SettingsPage({
  usage,
  onBack,
  onOpenPrivacy,
  onOpenTerms,
  onTogglePro,
}: SettingsPageProps) {
  const planLabel = usage.isPro ? 'PRO' : 'Free'

  return (
    <div className="view fade-in settings-page">
      <div className="settings-page__card">
        <button type="button" className="legal-page__back scale-button" onClick={onBack}>
          ← 返回
        </button>

        <header className="settings-page__header">
          <p className="legal-page__kicker">AI有點嘴 · SETTINGS</p>
          <h1 className="legal-page__title">設定</h1>
          <p className="legal-page__subtitle">方案、條款與隱私</p>
        </header>

        <section className="settings-section">
          <h2 className="settings-section__title">使用方案</h2>
          <div className="settings-plan-row">
            <span className={`usage-plan-badge ${usage.isPro ? 'usage-plan-badge--pro' : ''}`}>
              {planLabel}
            </span>
            <span className="settings-plan-detail">
              今日剩餘 {usage.remaining} / {usage.dailyLimit} 次
            </span>
          </div>
          <button type="button" className="debug-pro-toggle settings-pro-toggle" onClick={onTogglePro}>
            切換 PRO 模式（測試）
          </button>
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">法律與政策</h2>
          <div className="settings-link-list">
            <button type="button" className="settings-link-item scale-button" onClick={onOpenPrivacy}>
              <span className="settings-link-item__label">Privacy Policy</span>
              <span className="settings-link-item__hint">隱私權政策</span>
            </button>
            <button type="button" className="settings-link-item scale-button" onClick={onOpenTerms}>
              <span className="settings-link-item__label">Terms of Service</span>
              <span className="settings-link-item__hint">服務條款</span>
            </button>
          </div>
        </section>

        <p className="legal-page__footer-note">
          AI有點嘴不保證會改善你的人生，但可能讓你笑一下。
        </p>
      </div>
    </div>
  )
}
