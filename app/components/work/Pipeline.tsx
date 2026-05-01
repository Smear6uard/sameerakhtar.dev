import { useEffect, useMemo, useState } from 'react'

import {
  NODE_GLOW_GAP_MS,
  NODE_GLOW_HOLD_MS,
  type Pipeline as PipelineData,
  type PipelineNode,
} from './pipelines'

interface PipelineProps {
  pipeline: PipelineData
  reducedMotion: boolean
}

function edgePath(from: PipelineNode, to: PipelineNode): string {
  const x1 = from.x + from.width
  const y1 = from.y + from.height / 2
  const x2 = to.x
  const y2 = to.y + to.height / 2
  const midX = x1 + (x2 - x1) * 0.5
  return `M ${String(x1)} ${String(y1)} C ${String(midX)} ${String(y1)}, ${String(midX)} ${String(y2)}, ${String(x2)} ${String(y2)}`
}

function edgeMidpoint(from: PipelineNode, to: PipelineNode): { x: number; y: number } {
  const x1 = from.x + from.width
  const y1 = from.y + from.height / 2
  const x2 = to.x
  const y2 = to.y + to.height / 2
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
}

export function Pipeline({ pipeline, reducedMotion }: PipelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const nodeMap = useMemo(() => {
    const map = new Map<string, PipelineNode>()
    for (const node of pipeline.nodes) map.set(node.id, node)
    return map
  }, [pipeline])

  useEffect(() => {
    if (reducedMotion) {
      // Reset glow when reduced motion is toggled on; safe given no upstream
      // prop captures the active id.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveId(null)
      return
    }
    let mounted = true
    let i = 0
    let onTimer: ReturnType<typeof setTimeout> | null = null
    let offTimer: ReturnType<typeof setTimeout> | null = null

    const step = () => {
      if (!mounted) return
      const id = pipeline.cycleOrder[i % pipeline.cycleOrder.length] ?? null
      setActiveId(id)
      onTimer = setTimeout(() => {
        if (!mounted) return
        setActiveId(null)
        offTimer = setTimeout(() => {
          i++
          step()
        }, NODE_GLOW_GAP_MS)
      }, NODE_GLOW_HOLD_MS)
    }

    step()

    return () => {
      mounted = false
      if (onTimer !== null) clearTimeout(onTimer)
      if (offTimer !== null) clearTimeout(offTimer)
    }
  }, [pipeline, reducedMotion])

  return (
    <div className="pipeline" aria-hidden="true">
      <svg
        className="pipeline-svg"
        viewBox={`0 0 ${String(pipeline.viewBox.width)} ${String(pipeline.viewBox.height)}`}
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <g className="pipeline-edges">
          {pipeline.edges.map((edge) => {
            const from = nodeMap.get(edge.from)
            const to = nodeMap.get(edge.to)
            if (!from || !to) return null
            const path = edgePath(from, to)
            const isPulsing = activeId === edge.to
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={path}
                className={isPulsing ? 'pipeline-edge pipeline-edge--pulse' : 'pipeline-edge'}
              />
            )
          })}
          {pipeline.edges.map((edge) => {
            const from = nodeMap.get(edge.from)
            const to = nodeMap.get(edge.to)
            if (!from || !to) return null
            const mid = edgeMidpoint(from, to)
            const isPulsing = activeId === edge.to
            return (
              <circle
                key={`dot-${edge.from}-${edge.to}`}
                cx={mid.x}
                cy={mid.y}
                r={isPulsing ? 2.4 : 1.6}
                className={
                  isPulsing ? 'pipeline-edge-dot pipeline-edge-dot--pulse' : 'pipeline-edge-dot'
                }
              />
            )
          })}
        </g>

        <g className="pipeline-nodes">
          {pipeline.nodes.map((node) => {
            const isActive = activeId === node.id
            return (
              <foreignObject
                key={node.id}
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                className="pipeline-node-wrap"
              >
                <div
                  className={isActive ? 'pipeline-node pipeline-node--active' : 'pipeline-node'}
                  data-stack={node.items ? 'true' : undefined}
                >
                  <div className="pipeline-node-title">{node.title}</div>
                  {node.sublabel ? <div className="pipeline-node-sub">{node.sublabel}</div> : null}
                  {node.items ? (
                    <div className="pipeline-node-items">
                      {node.items.map((item) => (
                        <div key={item} className="pipeline-node-item">
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </foreignObject>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
