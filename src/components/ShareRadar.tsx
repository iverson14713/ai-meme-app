const AXES = ['理智', '衝動', '社死', '財務', '戀愛'] as const

const CX = 60
const CY = 60
const MAX_R = 28
const LABEL_OFFSET = 12
const VIEW_SIZE = 120

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  index: number,
  total: number,
) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  }
}

function polygonPoints(
  cx: number,
  cy: number,
  radius: number,
  values: number[],
) {
  return values
    .map((value, index) => {
      const point = polarPoint(cx, cy, (radius * value) / 100, index, values.length)
      return `${point.x},${point.y}`
    })
    .join(' ')
}

export function ShareRadar({ values }: { values: number[] }) {
  const gridLevels = [50, 100]

  return (
    <div className="share-card-radar">
      <svg
        className="share-card-radar-svg"
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        role="img"
        aria-hidden="true"
      >
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(CX, CY, (MAX_R * level) / 100, Array(5).fill(100))}
            className="share-radar-grid"
          />
        ))}

        {AXES.map((_, index) => {
          const end = polarPoint(CX, CY, MAX_R, index, AXES.length)
          return (
            <line
              key={AXES[index]}
              x1={CX}
              y1={CY}
              x2={end.x}
              y2={end.y}
              className="share-radar-axis"
            />
          )
        })}

        <polygon
          points={polygonPoints(CX, CY, MAX_R, values)}
          className="share-radar-data"
        />

        {AXES.map((label, index) => {
          const labelPoint = polarPoint(
            CX,
            CY,
            MAX_R + LABEL_OFFSET,
            index,
            AXES.length,
          )
          return (
            <text
              key={label}
              x={labelPoint.x}
              y={labelPoint.y}
              className="share-radar-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
