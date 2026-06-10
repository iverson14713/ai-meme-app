type UpgradeModalProps = {
  open: boolean
  variant: 'limit' | 'personality'
  onClose: () => void
  onUpgrade: () => void
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
  onClose,
  onUpgrade,
}: UpgradeModalProps) {
  if (!open) return null

  const title =
    variant === 'limit'
      ? '你的量子分析額度已用完'
      : '此功能需要 PRO'

  const roastLine =
    variant === 'limit'
      ? '免費額度已耗盡，宇宙不再免費提供情緒分析。'
      : null

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
        {roastLine && <p className="upgrade-roast">{roastLine}</p>}
        <p className="upgrade-subtitle">{subtitle}</p>

        <ul className="upgrade-features">
          {PRO_FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <div className="upgrade-pricing">
          <div className="upgrade-price-row">
            <span className="upgrade-price-label">月費</span>
            <span className="upgrade-price-value">NT$30/月</span>
          </div>
          <div className="upgrade-price-row">
            <span className="upgrade-price-label">年費</span>
            <span className="upgrade-price-value">NT$199/年</span>
          </div>
        </div>

        <button
          type="button"
          className="neon-button scale-button upgrade-cta"
          onClick={onUpgrade}
        >
          升級 PRO
        </button>
        <p className="upgrade-fake-note">測試模式：點擊即開通 PRO（尚未接付款）</p>

        <button type="button" className="upgrade-close" onClick={onClose}>
          先不要
        </button>
      </div>
    </div>
  )
}
