import { useEffect, useRef, useState } from 'react'

const PORTRAIT_SRC = '/profile.jpg'

export function PortraitCard() {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    if (img.complete) {
      if (img.naturalWidth === 0) {
        setFailed(true)
      }
      return
    }
    const onError = () => {
      setFailed(true)
    }
    img.addEventListener('error', onError)
    return () => {
      img.removeEventListener('error', onError)
    }
  }, [])

  return (
    <div className="portrait-card">
      {failed ? (
        <div className="portrait-card-fallback" aria-hidden="true">
          portrait
        </div>
      ) : (
        <img
          ref={imgRef}
          src={PORTRAIT_SRC}
          alt="Portrait of Sameer Akhtar"
          className="portrait-card-img"
          onError={() => {
            setFailed(true)
          }}
          loading="lazy"
          decoding="async"
        />
      )}

      <div
        className="portrait-card-bbox"
        aria-hidden="true"
        style={{ top: '14%', left: '22%', right: '22%', bottom: '38%' }}
      >
        <span className="portrait-card-bbox-bracket portrait-card-bbox-bracket--tl" />
        <span className="portrait-card-bbox-bracket portrait-card-bbox-bracket--tr" />
        <span className="portrait-card-bbox-bracket portrait-card-bbox-bracket--bl" />
        <span className="portrait-card-bbox-bracket portrait-card-bbox-bracket--br" />
        <span className="portrait-card-bbox-label">
          person
          <span className="portrait-card-bbox-confidence">0.97</span>
        </span>
      </div>
    </div>
  )
}
