import { SHARE_LOGO_URL } from '../share/shareLogo'

type SplashScreenProps = {
  message: string
}

export function SplashScreen({ message }: SplashScreenProps) {
  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="splash-screen__scanlines" aria-hidden="true" />
      <div className="splash-screen__grid" aria-hidden="true" />
      <div className="splash-screen__glow-orb" aria-hidden="true" />

      <div className="splash-screen__content">
        <div className="splash-screen__logo-wrap">
          <img
            className="splash-screen__logo"
            src={SHARE_LOGO_URL}
            alt=""
            decoding="sync"
          />
        </div>
        <h1 className="splash-screen__title">AI有點嘴</h1>
        <p className="splash-screen__tagline">{message}</p>
      </div>
    </div>
  )
}
