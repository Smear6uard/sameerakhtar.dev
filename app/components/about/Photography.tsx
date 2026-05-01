import { useEffect, useRef, useState } from 'react'

const PHOTOS = [
  { id: 'photo-01', src: '/photography/DSCF0606.JPG', label: 'Photo 01' },
  { id: 'photo-02', src: '/photography/DSCF1295.JPG', label: 'Photo 02' },
  { id: 'photo-03', src: '/photography/DSCF1748.JPG', label: 'Photo 03' },
  { id: 'photo-04', src: '/photography/DSCF2111.jpg', label: 'Photo 04' },
] as const

type PhotoId = (typeof PHOTOS)[number]['id']

function PhotoImg({
  src,
  alt,
  className,
  onFail,
}: {
  src: string
  alt: string
  className: string
  onFail: () => void
}) {
  const ref = useRef<HTMLImageElement | null>(null)
  useEffect(() => {
    const img = ref.current
    if (!img) return
    if (img.complete && img.naturalWidth === 0) {
      onFail()
      return
    }
    const handle = () => {
      onFail()
    }
    img.addEventListener('error', handle)
    return () => {
      img.removeEventListener('error', handle)
    }
  }, [onFail])

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onError={onFail}
      loading="lazy"
      decoding="async"
    />
  )
}

export function Photography() {
  const [activeId, setActiveId] = useState<PhotoId>('photo-01')
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const thumbs = PHOTOS.filter((p) => p.id !== activeId)

  return (
    <div className="photography">
      <div className="section-eyebrow" style={{ marginBottom: 18 }}>
        <span className="section-eyebrow-bar" aria-hidden="true" />
        <span className="section-eyebrow-label">Photography</span>
      </div>

      <div className="photography-rail">
        <div className="photography-stage">
          {PHOTOS.map((photo) =>
            failed[photo.id] ? null : (
              <PhotoImg
                key={photo.id}
                src={photo.src}
                alt={photo.label}
                className={`photography-stage-img ${
                  photo.id === activeId ? 'photography-stage-img--active' : ''
                }`}
                onFail={() => {
                  setFailed((prev) => (prev[photo.id] ? prev : { ...prev, [photo.id]: true }))
                }}
              />
            ),
          )}
          {failed[activeId] ? (
            <div className="photography-stage-fallback" aria-hidden="true">
              {PHOTOS.find((p) => p.id === activeId)?.label}
            </div>
          ) : null}
        </div>

        <div className="photography-thumbs">
          {thumbs.map((photo) => (
            <button
              key={photo.id}
              type="button"
              className={`photography-thumb ${
                photo.id === activeId ? 'photography-thumb--active' : ''
              }`}
              onClick={() => {
                setActiveId(photo.id)
              }}
              aria-label={`View ${photo.label}`}
            >
              {!failed[photo.id] ? (
                <PhotoImg
                  src={photo.src}
                  alt={photo.label}
                  className="photography-thumb-img"
                  onFail={() => {
                    setFailed((prev) => (prev[photo.id] ? prev : { ...prev, [photo.id]: true }))
                  }}
                />
              ) : (
                <div className="photography-stage-fallback" aria-hidden="true">
                  {photo.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="photography-caption">Shot on Fujifilm X-T30 II</p>
    </div>
  )
}
