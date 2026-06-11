import { useCallback, useEffect, useState } from 'react'
import {
  PURCHASE_CANCELLED_MESSAGE,
  PURCHASE_SUCCESS_MESSAGE,
} from './restoreFeedback'
import { loadUsageSnapshot, setProMode, type UsageSnapshot } from '../usage/planLimits'
import {
  checkActiveSubscription,
  fetchProductPrices,
  initializeSubscriptions,
  isIapAvailable,
  type ProductPriceInfo,
  type ProPlan,
  purchaseProPlan,
  restoreProPurchases,
} from './subscriptionService'

export type SubscriptionActionResult = {
  snapshot: UsageSnapshot
  error?: string
  cancelled?: boolean
  successMessage?: string
}

type SubscriptionSyncState = {
  iapReady: boolean
  prices: ProductPriceInfo
  purchasing: boolean
  restoring: boolean
  actionError: string
  refreshSubscription: () => Promise<UsageSnapshot>
  purchasePlan: (plan: ProPlan) => Promise<SubscriptionActionResult>
  restorePurchases: () => Promise<SubscriptionActionResult>
  clearActionError: () => void
}

export function useSubscriptionSync(
  onUsageChange: (snapshot: UsageSnapshot) => void,
): SubscriptionSyncState {
  const [iapReady, setIapReady] = useState(false)
  const [prices, setPrices] = useState<ProductPriceInfo>(() => ({
    monthly: 'NT$30/月',
    yearly: 'NT$199/年',
  }))
  const [purchasing, setPurchasing] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [actionError, setActionError] = useState('')

  const applySubscriptionStatus = useCallback(
    async (isPro: boolean) => {
      const snapshot = setProMode(isPro)
      onUsageChange(snapshot)
      return snapshot
    },
    [onUsageChange],
  )

  const refreshSubscription = useCallback(async () => {
    if (!isIapAvailable()) {
      return setProMode(false)
    }

    const isPro = await checkActiveSubscription()
    return applySubscriptionStatus(isPro)
  }, [applySubscriptionStatus])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!isIapAvailable()) {
        setIapReady(false)
        return
      }

      const supported = await initializeSubscriptions()
      if (cancelled) return
      setIapReady(supported)

      if (supported) {
        const [nextPrices, isPro] = await Promise.all([
          fetchProductPrices(),
          checkActiveSubscription(),
        ])
        if (cancelled) return
        setPrices(nextPrices)
        await applySubscriptionStatus(isPro)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [applySubscriptionStatus])

  const purchasePlan = useCallback(
    async (plan: ProPlan): Promise<SubscriptionActionResult> => {
      setActionError('')
      setPurchasing(true)
      try {
        const result = await purchaseProPlan(plan)
        if (!result.ok) {
          if (result.cancelled) {
            setActionError(PURCHASE_CANCELLED_MESSAGE)
            return {
              snapshot: loadUsageSnapshot(),
              cancelled: true,
              error: PURCHASE_CANCELLED_MESSAGE,
            }
          }
          setActionError(result.message)
          return { snapshot: loadUsageSnapshot(), error: result.message }
        }
        const snapshot = await applySubscriptionStatus(true)
        return { snapshot, successMessage: PURCHASE_SUCCESS_MESSAGE }
      } finally {
        setPurchasing(false)
      }
    },
    [applySubscriptionStatus],
  )

  const restorePurchases = useCallback(async (): Promise<SubscriptionActionResult> => {
    setActionError('')
    setRestoring(true)
    try {
      const result = await restoreProPurchases()
      if (!result.ok) {
        setActionError(result.message)
        return { snapshot: loadUsageSnapshot(), error: result.message }
      }
      const snapshot = await applySubscriptionStatus(result.isPro)
      return { snapshot }
    } finally {
      setRestoring(false)
    }
  }, [applySubscriptionStatus])

  const clearActionError = useCallback(() => setActionError(''), [])

  return {
    iapReady,
    prices,
    purchasing,
    restoring,
    actionError,
    refreshSubscription,
    purchasePlan,
    restorePurchases,
    clearActionError,
  }
}
