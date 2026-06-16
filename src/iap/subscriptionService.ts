import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases'
import {
  PRO_FALLBACK_PRICES,
  PRO_PRODUCT_IDS,
  PRO_PRODUCT_MONTHLY,
  PRO_PRODUCT_YEARLY,
  type ProProductId,
} from './constants'
import { formatProPriceForDisplay } from './formatProPrice'
import { isNativeApp } from '../platform/runtime'

export type ProPlan = 'monthly' | 'yearly'

export type ProductPriceInfo = {
  monthly: string
  yearly: string
}

export type PurchaseResult =
  | { ok: true; isPro: true }
  | { ok: false; cancelled?: boolean; message: string }

export type RestoreResult =
  | { ok: true; isPro: boolean }
  | { ok: false; message: string }

function planToProductId(plan: ProPlan): ProProductId {
  return plan === 'monthly' ? PRO_PRODUCT_MONTHLY : PRO_PRODUCT_YEARLY
}

function isActiveProPurchase(productIdentifier: string, isActive?: boolean): boolean {
  if (!PRO_PRODUCT_IDS.includes(productIdentifier as ProProductId)) return false
  return isActive !== false
}

export function isIapAvailable(): boolean {
  return isNativeApp()
}

export async function initializeSubscriptions(): Promise<boolean> {
  if (!isIapAvailable()) return false

  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported()
    return isBillingSupported
  } catch (error) {
    console.warn('[IAP] Billing support check failed:', error)
    return false
  }
}

export async function fetchProductPrices(): Promise<ProductPriceInfo> {
  if (!isIapAvailable()) {
    return { ...PRO_FALLBACK_PRICES }
  }

  try {
    const { products } = await NativePurchases.getProducts({
      productIdentifiers: [...PRO_PRODUCT_IDS],
      productType: PURCHASE_TYPE.SUBS,
    })

    const monthly = products.find((p) => p.identifier === PRO_PRODUCT_MONTHLY)
    const yearly = products.find((p) => p.identifier === PRO_PRODUCT_YEARLY)

    return {
      monthly: formatProPriceForDisplay(
        monthly?.priceString,
        'monthly',
      ),
      yearly: formatProPriceForDisplay(yearly?.priceString, 'yearly'),
    }
  } catch (error) {
    console.warn('[IAP] Failed to load product prices:', error)
    return { ...PRO_FALLBACK_PRICES }
  }
}

export async function checkActiveSubscription(): Promise<boolean> {
  if (!isIapAvailable()) return false

  try {
    const { purchases } = await NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.SUBS,
      onlyCurrentEntitlements: true,
    })

    return purchases.some((purchase) =>
      isActiveProPurchase(purchase.productIdentifier, purchase.isActive),
    )
  } catch (error) {
    console.warn('[IAP] Subscription status check failed:', error)
    return false
  }
}

function purchaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.trim()
    if (/cancel/i.test(msg) || /user.*cancel/i.test(msg)) {
      return '已取消購買'
    }
    return msg || '購買失敗，請稍後再試'
  }
  return '購買失敗，請稍後再試'
}

function isUserCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return /cancel/i.test(error.message)
}

export async function purchaseProPlan(plan: ProPlan): Promise<PurchaseResult> {
  if (!isIapAvailable()) {
    return { ok: false, message: '請在 iOS App 內購買 PRO 方案' }
  }

  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported()
    if (!isBillingSupported) {
      return { ok: false, message: '此裝置不支援 App 內購買' }
    }

    const productIdentifier = planToProductId(plan)
    const transaction = await NativePurchases.purchaseProduct({
      productIdentifier,
      productType: PURCHASE_TYPE.SUBS,
    })

    if (!isActiveProPurchase(transaction.productIdentifier, transaction.isActive)) {
      return { ok: false, message: '購買未完成，請稍後再試或聯絡客服' }
    }

    const active = await checkActiveSubscription()
    if (!active) {
      return { ok: false, message: '購買驗證失敗，請使用「恢復購買」或稍後再試' }
    }

    return { ok: true, isPro: true }
  } catch (error) {
    return {
      ok: false,
      cancelled: isUserCancelled(error),
      message: purchaseErrorMessage(error),
    }
  }
}

export async function restoreProPurchases(): Promise<RestoreResult> {
  if (!isIapAvailable()) {
    return { ok: false, message: '請在 iOS App 內恢復購買' }
  }

  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported()
    if (!isBillingSupported) {
      return { ok: false, message: '此裝置不支援 App 內購買' }
    }

    await NativePurchases.restorePurchases()
    const isPro = await checkActiveSubscription()
    return { ok: true, isPro }
  } catch (error) {
    return { ok: false, message: purchaseErrorMessage(error) }
  }
}
