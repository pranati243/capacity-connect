// Validated categorical order (CVD-safe on light surface); brand navy/saffron fail the lightness band for marks.
export const SERIES = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
}

export const AXIS_TICK = { fontSize: 11, fill: '#52514e' }
export const GRID_STROKE = '#e7e6e2'
export const LEGEND_PROPS = {
  wrapperStyle: { fontSize: 12 },
  formatter: (value: string) => <span style={{ color: '#52514e' }}>{value}</span>,
}
