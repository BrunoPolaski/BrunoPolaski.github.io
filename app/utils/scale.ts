/** Maps a value from [d0, d1] to [r0, r1]. */
export function linear(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0)
}

/** Round axis ticks from 0 up to a clean max covering `max` (1/2/2.5/5 × 10^n steps). */
export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0]
  const raw = max / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = ([1, 2, 2.5, 5, 10].find(m => m * mag >= raw) ?? 10) * mag
  const ticks: number[] = []
  for (let t = 0; t < max + step; t += step) ticks.push(Math.round(t * 1e6) / 1e6)
  return ticks
}

const compactFmt = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
export const compact = (v: number) => compactFmt.format(v)
