import { useEffect, useState } from 'react'
import { PRO_PLAN_LABELS, WEB_UPGRADE_NOTE } from '../iap/constants'
import {
  isSuccessFeedbackMessage,
  PURCHASE_CANCELLED_MESSAGE,
  PURCHASE_SUCCESS_MESSAGE,
} from '../iap/restoreFeedback'
import {
  isIapAvailable,
  type ProductPriceInfo,
  type ProPlan,
} from '../iap/subscriptionService'
import {
  pickRandomUpgradeRoast,
  type UpgradeRoastPick,
} from '../upgrade/randomUpgradeRoastTexts'

type UpgradeModalProps = {
  open: boolean
  variant: 'limit' | 'personality'
  prices: ProductPriceInfo
  purchasing: boolean
  restoring: boolean
  feedbackMessage: string
  errorMessage: string
  onClose: () => void
  onPurchase: (plan: ProPlan) => void
  onRestore: () => void
  onClearMessages: () => void
}

const PRO_FEATURES = [
  '解鎖全部人格',
  '每日 20 次分析',
  '地獄加辣模式',
  '更完整 AI 嘴炮',
]

export function UpgradeModal({
  open,
  variant,
  prices,
  purchasing,
  restoring,
  feedbackMessage,
  errorMessage,
  onClose,
  onPurchase,
  onRestore,
  onClearMessages,
}: UpgradeModalProps) {
  const [roast, setRoast] = useState<UpgradeRoastPick>(() => pickRandomUpgradeRoast())
  const iapAvailable = isIapAvailable()
  const isCancelled = errorMessage === PURCHASE_CANCELLED_MESSAGE

  useEffect(() => {
    if (open) {
      setRoast(pickRandomUpgradeRoast())
      onClearMessages()
    }
  }, [open, onClearMessages])

  if (!open) return null

  const title =
    variant === 'limit'
      ? '你的量子分析額度已用完'
      : '此功能需要 PRO'

  const subtitle =
    variant === 'limit'
      ? '明天重置，或升級 PRO 讓 AI 繼續一本正經嘲笑你。'
      : '升級 PRO 解鎖全部 AI 人格與更多分析次數。'

  return (
    <div className="upgrade-overlay" onClick={onClose} role="presentation">
      <div
        className="upgrade-card card-appear"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
      >
        <span className="upgrade-badge">PRO UPGRADE</span>
        <h2 id="upgrade-title" className="upgrade-title glow-text">
          {title}
        </h2>
        <p
          className={`upgrade-roast upgrade-roast--${roast.tier}`}
          key={roast.text}
        >
          {roast.text}
        </p>
        <p className="upgrade-subtitle">{subtitle}</p>

        <ul className="upgrade-features">
          {PRO_FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        {iapAvailable ? (
          <div className="upgrade-pricing">
            <button
              type="button"
              className="upgrade-price-option scale-button"
              onClick={() => onPurchase('monthly')}
              disabled={purchasing || restoring}
            >
              <span className="upgrade-price-label">{PRO_PLAN_LABELS.monthly}</span>
              <span className="upgrade-price-value">{prices.monthly}</span>
            </button>
            <button
              type="button"
              className="upgrade-price-option upgrade-price-option--featured scale-button"
              onClick={() => onPurchase('yearly')}
              disabled={purchasing || restoring}
            >
              <span className="upgrade-price-label">{PRO_PLAN_LABELS.yearly}</span>
              <span className="upgrade-price-value">{prices.yearly}</span>
              <span className="upgrade-price-hint">最划算</span>
            </button>
          </div>
        ) : (
          <p className="upgrade-web-note">{WEB_UPGRADE_NOTE}</p>
        )}

        {purchasing && <p className="upgrade-status">正在處理購買...</p>}
        {restoring && <p className="upgrade-status">正在恢復購買...</p>}
        {feedbackMessage && (
          <p
            className={`upgrade-feedback ${isSuccessFeedbackMessage(feedbackMessage) ? 'upgrade-feedback--success' : ''}`}
          >
            {feedbackMessage}
          </p>
        )}
        {errorMessage && (
          <p
            className={
              isCancelled ? 'upgrade-feedback upgrade-feedback--muted' : 'upgrade-error'
            }
          >
            {errorMessage}
          </p>
        )}

        {iapAvailable && (
          <button
            type="button"
            className="upgrade-restore-link"
            onClick={onRestore}
            disabled={purchasing || restoring}
          >
            已購買？恢復購買
          </button>
        )}

        <button
          type="button"
          className="upgrade-close"
          onClick={onClose}
          disabled={purchasing || restoring}
        >
          {feedbackMessage === PURCHASE_SUCCESS_MESSAGE ? '開始使用 PRO' : '先不要'}
        </button>
      </div>
    </div>
  )
}
