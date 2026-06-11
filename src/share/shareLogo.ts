import logoUrl from '../assets/logo.png'

export const SHARE_LOGO_URL = logoUrl

let cachedLogoDataUrl: string | null = null
let logoDataUrlPromise: Promise<string> | null = null

async function loadLogoAsDataUrl(): Promise<string> {
  const img = new Image()
  img.src = logoUrl
  img.decoding = 'async'
  await img.decode()

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('無法建立 logo canvas')
  }

  ctx.drawImage(img, 0, 0)
  cachedLogoDataUrl = canvas.toDataURL('image/png')
  return cachedLogoDataUrl
}

/** 預載 logo 並轉成 base64，供 html-to-image 穩定嵌入 */
export function getShareLogoDataUrl(): Promise<string> {
  if (cachedLogoDataUrl) {
    return Promise.resolve(cachedLogoDataUrl)
  }

  if (!logoDataUrlPromise) {
    logoDataUrlPromise = loadLogoAsDataUrl().catch((error) => {
      logoDataUrlPromise = null
      throw error
    })
  }

  return logoDataUrlPromise
}

export function preloadShareLogo(): Promise<string> {
  return getShareLogoDataUrl()
}

const SHARE_LOGO_SELECTOR =
  'img[data-share-logo="true"], img.share-brand-logo__icon, img.app-icon'

/** 產生分享圖前：內嵌 base64 logo 並等待所有 img decode */
export async function ensureShareImagesReady(root: HTMLElement): Promise<void> {
  const logoDataUrl = await getShareLogoDataUrl()

  root.querySelectorAll(SHARE_LOGO_SELECTOR).forEach((node) => {
    if (node instanceof HTMLImageElement) {
      node.src = logoDataUrl
    }
  })

  const images = root.querySelectorAll('img')
  await Promise.all(
    Array.from(images).map(async (img) => {
      if (!img.complete || img.naturalWidth === 0) {
        await img.decode().catch(() => undefined)
      }
    }),
  )

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}
