import { useState } from 'react'
import { unlockDeveloperMode, verifyDeveloperCode } from '../dev/developerMode'

type DeveloperUnlockModalProps = {
  open: boolean
  onClose: () => void
  onUnlocked: () => void
}

export function DeveloperUnlockModal({
  open,
  onClose,
  onUnlocked,
}: DeveloperUnlockModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  if (!open) return null

  const handleClose = () => {
    setCode('')
    setError('')
    onClose()
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setChecking(true)
    setError('')

    try {
      if (!verifyDeveloperCode(code)) {
        setError('驗證失敗')
        return
      }

      unlockDeveloperMode()
      setCode('')
      onUnlocked()
      onClose()
    } catch {
      setError('驗證失敗')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="dev-unlock-overlay" onClick={handleClose} role="presentation">
      <form
        className="dev-unlock-card card-appear"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dev-unlock-title"
      >
        <p className="dev-unlock-kicker">VERIFICATION</p>
        <h2 id="dev-unlock-title" className="dev-unlock-title">
          開發者驗證
        </h2>
        <p className="dev-unlock-hint">請輸入開發者碼以繼續。</p>

        <input
          className="dev-unlock-input"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="開發者碼"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="text"
          autoFocus
        />

        {error && <p className="dev-unlock-error">{error}</p>}

        <button
          type="submit"
          className="neon-button scale-button dev-unlock-submit"
          disabled={checking || !code.trim()}
        >
          {checking ? '驗證中...' : '確認'}
        </button>

        <button type="button" className="dev-unlock-cancel" onClick={handleClose}>
          取消
        </button>
      </form>
    </div>
  )
}
