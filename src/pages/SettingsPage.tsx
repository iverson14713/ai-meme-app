import { SHARE_LOGO_URL } from '../share/shareLogo'
import { useSecretLogoTap } from '../dev/useSecretLogoTap'
import {
  RESTORE_NOT_FOUND_MESSAGE,
  RESTORE_SUCCESS_MESSAGE,
} from '../iap/restoreFeedback'
import { isIapAvailable } from '../iap/subscriptionService'
import { getPrivacyPath, getTermsPath } from '../routing/legalPaths'
import type { UsageSnapshot } from '../usage/planLimits'

type SettingsPageProps = {
  usage: UsageSnapshot
  restoring: boolean
  restoreMessage: string
  onBack: () => void
  onRestorePurchases: () => void
  onSecretLogoTap: () => void
}

export function SettingsPage({
  usage,
  restoring,
  restoreMessage,
  onBack,
  onRestorePurchases,
  onSecretLogoTap,
}: SettingsPageProps) {
  const onLogoTap = useSecretLogoTap(onSecretLogoTap)
  const planLabel = usage.isDeveloper ? 'DEV' : usage.isPro ? 'PRO' : 'Free'
  const iapAvailable = isIapAvailable()

  return (
    <div className="view fade-in settings-page">
      <div className="settings-page__card">
        <button type="button" className="legal-page__back scale-button" onClick={onBack}>
          ← 返回
        </button>

        <header className="settings-page__header">
          <img
            className="settings-page__logo app-icon--secret-tap"
            src={SHARE_LOGO_URL}
            alt=""
            aria-hidden="true"
            onClick={onLogoTap}
          />
          <p className="legal-page__kicker">AI有點嘴 · SETTINGS</p>
          <h1 className="legal-page__title">設定</h1>
          <p className="legal-page__subtitle">方案、條款與隱私</p>
        </header>

        <section className="settings-section">
          <h2 className="settings-section__title">使用方案</h2>
          <div className="settings-plan-row">
            <span
              className={`usage-plan-badge ${usage.isDeveloper || usage.isPro ? 'usage-plan-badge--pro' : ''} ${usage.isDeveloper ? 'usage-plan-badge--dev' : ''}`}
            >
              {planLabel}
            </span>
            <span className="settings-plan-detail">
              {usage.isDeveloper
                ? '開發者模式 · 無限次數'
                : usage.isPro
                  ? `PRO · 今日剩餘 ${usage.remaining} / ${usage.dailyLimit} 次`
                  : `Free · 今日剩餘 ${usage.remaining} / ${usage.dailyLimit} 次`}
            </span>
          </div>
          {iapAvailable && (
            <button
              type="button"
              className="settings-restore-button scale-button"
              onClick={onRestorePurchases}
              disabled={restoring}
            >
              {restoring ? '恢復中...' : '恢復購買'}
            </button>
          )}
          {restoreMessage && (
            <p
              className={`settings-restore-message ${restoreMessage === RESTORE_SUCCESS_MESSAGE ? 'settings-restore-message--success' : ''} ${restoreMessage !== RESTORE_SUCCESS_MESSAGE && restoreMessage !== RESTORE_NOT_FOUND_MESSAGE ? 'settings-restore-message--error' : ''}`}
            >
              {restoreMessage}
            </p>
          )}
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">法律與政策</h2>
          <div className="settings-link-list">
            <a className="settings-link-item scale-button" href={getPrivacyPath()}>
              <span className="settings-link-item__label">Privacy Policy</span>
              <span className="settings-link-item__hint">隱私權政策</span>
            </a>
            <a className="settings-link-item scale-button" href={getTermsPath()}>
              <span className="settings-link-item__label">Terms of Service</span>
              <span className="settings-link-item__hint">服務條款</span>
            </a>
          </div>
        </section>

        <p className="legal-page__footer-note">
          AI有點嘴不保證會改善你的人生，但可能讓你笑一下。
        </p>
      </div>
    </div>
  )
}
