import { PRO_FALLBACK_PRICES } from './constants'

type ProPlan = 'monthly' | 'yearly'

const PERIOD_SUFFIX: Record<ProPlan, string> = {
  monthly: '/月',
  yearly: '/年',
}

function extractAmount(priceString: string): number | null {
  const normalized = priceString.replace(/,/g, '')
  const match = normalized.match(/(\d+(?:\.\d+)?)/)
  if (!match) return null
  const amount = Number(match[1])
  return Number.isFinite(amount) ? amount : null
}

function formatNtAmount(amount: number, plan: ProPlan): string {
  const rounded = Math.round(amount * 100) / 100
  const display =
    Number.isInteger(rounded) || rounded % 1 === 0
      ? String(Math.round(rounded))
      : String(rounded)
  return `NT$${display}${PERIOD_SUFFIX[plan]}`
}

/** Normalize StoreKit / fallback price strings for in-app display (TWD). */
export function formatProPriceForDisplay(
  rawPrice: string | undefined | null,
  plan: ProPlan,
): string {
  const fallback = PRO_FALLBACK_PRICES[plan]
  if (!rawPrice?.trim()) return fallback

  const trimmed = rawPrice.trim()

  if (/^NT\$[\d,]+(?:\.\d+)?\/[月年]$/.test(trimmed)) {
    return trimmed
  }

  if (/NT\$|新台幣|TWD/i.test(trimmed)) {
    const amount = extractAmount(trimmed)
    if (amount != null) return formatNtAmount(amount, plan)
  }

  // StoreKit in Taiwan may return "$30.00" — show as NT$ to avoid USD confusion.
  if (/^\$/.test(trimmed)) {
    const amount = extractAmount(trimmed)
    if (amount != null) return formatNtAmount(amount, plan)
  }

  const amount = extractAmount(trimmed)
  if (amount != null) {
    return formatNtAmount(amount, plan)
  }

  return fallback
}

export function formatProPriceInfo(prices: {
  monthly: string
  yearly: string
}): { monthly: string; yearly: string } {
  return {
    monthly: formatProPriceForDisplay(prices.monthly, 'monthly'),
    yearly: formatProPriceForDisplay(prices.yearly, 'yearly'),
  }
}
