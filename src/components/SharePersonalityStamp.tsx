import type { PersonalityId } from '../personalities'
import { getPersonalityStamp } from '../share/sharePersonalityStamp'

type SharePersonalityStampProps = {
  personalityId: PersonalityId
}

export function SharePersonalityStamp({ personalityId }: SharePersonalityStampProps) {
  const stamp = getPersonalityStamp(personalityId)

  return (
    <div
      className={`share-personality-stamp share-personality-stamp--${personalityId}`}
      style={{ transform: `rotate(${stamp.rotation}deg)` }}
      aria-hidden="true"
    >
      <div className="share-personality-stamp__inner">
        <span className="share-personality-stamp__main">{stamp.main}</span>
        {stamp.sub ? (
          <span className="share-personality-stamp__sub">{stamp.sub}</span>
        ) : null}
      </div>
    </div>
  )
}
