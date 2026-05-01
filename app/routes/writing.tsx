import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/writing')({
  component: WritingRoute,
})

function WritingRoute() {
  return (
    <div className="writing-placeholder">
      <span className="writing-placeholder-eyebrow">Writing</span>
      <h1 className="writing-placeholder-title">Coming soon.</h1>
      <p className="writing-placeholder-body">
        Notes on shipping ML to production, computer vision, and the math underneath it. The first
        post drops this summer.
      </p>
    </div>
  )
}
