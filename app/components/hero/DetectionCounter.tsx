interface DetectionCounterProps {
  scanned: number
  total: number
}

export function DetectionCounter({ scanned, total }: DetectionCounterProps) {
  const isComplete = total > 0 && scanned >= total

  return (
    <div
      className={isComplete ? 'detection-counter detection-counter--complete' : 'detection-counter'}
      aria-live="polite"
    >
      {isComplete ? (
        'SCAN COMPLETE'
      ) : (
        <>
          TARGETS <span className="detection-counter-value">{scanned}</span>
          {' / '}
          {total}
        </>
      )}
    </div>
  )
}
