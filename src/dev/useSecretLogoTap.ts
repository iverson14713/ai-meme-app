import { useCallback, useRef } from 'react'

const TAP_TARGET = 7
const TAP_RESET_MS = 2500

export function useSecretLogoTap(onTrigger: () => void) {
  const tapCountRef = useRef(0)
  const resetTimerRef = useRef<number | null>(null)

  const onSecretTap = useCallback(() => {
    tapCountRef.current += 1

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0
      resetTimerRef.current = null
    }, TAP_RESET_MS)

    if (tapCountRef.current >= TAP_TARGET) {
      tapCountRef.current = 0
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = null
      }
      onTrigger()
    }
  }, [onTrigger])

  return onSecretTap
}
