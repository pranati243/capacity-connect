// Validated categorical order (CVD-safe on light surface); brand navy/saffron fail the lightness band for marks.
export const SERIES = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
}

// CSS custom properties so the same chart reads correctly in both themes without
// re-rendering (see :root / html.dark in index.css for the light/dark values).
export const AXIS_TICK = { fontSize: 11, fill: 'var(--chart-axis)' }
export const GRID_STROKE = 'var(--chart-grid)'
export const LEGEND_PROPS = {
  wrapperStyle: { fontSize: 12 },
  formatter: (value: string) => <span style={{ color: 'var(--chart-legend)' }}>{value}</span>,
}
