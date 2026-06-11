import { useEffect, useState } from 'react'
import {
  pickHomeStatLine,
  type HomeStatLine,
} from '../home/homeStatLines'

const ROTATE_MS = 5000

export function HomeStatRotator() {
  const [stat, setStat] = useState<HomeStatLine>(() => pickHomeStatLine())
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStat((prev) => pickHomeStatLine(prev.text))
      setAnimKey((k) => k + 1)
    }, ROTATE_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <p
      key={animKey}
      className={`subtitle home-stat-line home-stat-line--${stat.tier}`}
      aria-live="polite"
    >
      {stat.text}
    </p>
  )
}
