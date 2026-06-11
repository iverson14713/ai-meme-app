import { Capacitor } from '@capacitor/core'

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform()
}

export function isNativeIOS(): boolean {
  return Capacitor.getPlatform() === 'ios'
}

/** Show the in-app debug panel (Vite dev server only, not Capacitor production builds). */
export function showDebugPanel(): boolean {
  return import.meta.env.DEV
}
