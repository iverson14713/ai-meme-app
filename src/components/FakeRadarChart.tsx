const AXES = ['理智', '衝動', '社死', '財務', '戀愛'] as const

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

export function FakeRadarChart({ values }: { values: number[] }) {
  const cx = 110
  const cy = 110
  const maxR = 72
  const gridLevels = [25, 50, 75, 100]

  return (
    <div className="radar-chart-wrap card-appear" style={{ animationDelay: '0.2s' }}>
      <div className="radar-chart-header">
        <span>量子雷達圖</span>
        <span className="radar-chart-tag">NEURAL SCAN</span>
      </div>
      <svg
        className="radar-chart"
        viewBox="0 0 220 220"
        role="img"
        aria-label="假分析雷達圖"
      >
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(cx, cy, (maxR * level) / 100, Array(5).fill(100))}
            className="radar-grid"
          />
        ))}

        {AXES.map((_, index) => {
          const end = polarPoint(cx, cy, maxR, index, AXES.length)
          return (
            <line
              key={AXES[index]}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              className="radar-axis"
            />
          )
        })}

        <polygon
          points={polygonPoints(cx, cy, maxR, values)}
          className="radar-data"
        />

        {AXES.map((label, index) => {
          const labelPoint = polarPoint(cx, cy, maxR + 16, index, AXES.length)
          return (
            <text
              key={label}
              x={labelPoint.x}
              y={labelPoint.y}
              className="radar-label"
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
