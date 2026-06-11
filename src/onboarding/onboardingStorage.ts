const STORAGE_ONBOARDING = 'onboarding_completed'

export function isOnboardingCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_ONBOARDING) === 'true'
  } catch {
    return false
  }
}

export function completeOnboarding(): void {
  try {
    localStorage.setItem(STORAGE_ONBOARDING, 'true')
  } catch {
    // ignore quota / private mode
  }
}
