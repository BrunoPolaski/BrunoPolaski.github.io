<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number
  speed?: number
  /** Colour the shell in horizontal bands, one per entry, sized by share (top band first). */
  bands?: { color: string, share: number }[]
  /** Band index to keep lit; the others dim. */
  focus?: number | null
}>(), { count: 5200, speed: 1 })

const canvas = ref<HTMLCanvasElement>()
const tilt = { x: 0, y: 0 }

// Fibonacci sphere: evenly spread points, no clustering at the poles.
const golden = Math.PI * (3 - Math.sqrt(5))
const points = Array.from({ length: props.count }, (_, i) => {
  const y = 1 - (i / (props.count - 1)) * 2
  const r = Math.sqrt(1 - y * y)
  return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r] as const
})

// Point i sits at height 1 - 2i/(n-1), and a sphere zone's area is proportional to its
// height, so an index range holding share s of the points covers exactly s of the surface.
// Canvas y points down, so f counts from the last point to put band 0 on top.
const band = computed(() => {
  const bands = props.bands
  if (!bands?.length) return null
  const total = bands.reduce((sum, b) => sum + b.share, 0)
  const edges = [0]
  for (const b of bands) edges.push(edges.at(-1)! + b.share / total)
  const last = bands.length - 1
  const gap = 0.006 // half-width of the empty seam between bands; -1 = point in a seam
  return Int8Array.from({ length: props.count }, (_, i) => {
    const f = 1 - i / (props.count - 1)
    let k = 0
    while (k < last && f >= edges[k + 1]!) k++
    return (k > 0 && f - edges[k]! < gap) || (k < last && edges[k + 1]! - f < gap) ? -1 : k
  })
})
const rgb = computed(() => props.bands?.map(b => [1, 3, 5].map(o => parseInt(b.color.slice(o, o + 2), 16)) as [number, number, number]))

function onMove(e: PointerEvent) {
  const b = canvas.value!.getBoundingClientRect()
  tilt.x = ((e.clientY - b.top) / b.height - 0.5) * 0.8
  tilt.y = ((e.clientX - b.left) / b.width - 0.5) * 0.8
}

useCanvasLoop(canvas, (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h)
  const R = Math.min(w, h) * 0.38
  const cx = w / 2, cy = h / 2
  const a = t * 0.00018 * props.speed + tilt.y
  const cosA = Math.cos(a), sinA = Math.sin(a), cosB = Math.cos(tilt.x), sinB = Math.sin(tilt.x)

  // soft glow behind the shell
  const bands = band.value, colors = rgb.value, focus = props.focus
  const glow = bands ? '255,255,255' : '60,60,255' // neutral behind data colours
  const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.25)
  g.addColorStop(0, `rgba(${glow},${bands ? 0.07 : 0.18})`)
  g.addColorStop(1, `rgba(${glow},0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < points.length; i++) {
    const k = bands ? bands[i]! : 0
    if (k < 0) continue
    const [px, py, pz] = points[i]!
    const x1 = px * cosA - pz * sinA
    const z1 = px * sinA + pz * cosA
    const y1 = py * cosB - z1 * sinB
    const z2 = py * sinB + z1 * cosB
    const depth = (z2 + 1.2) / 2.2
    const rim = 1 - Math.abs(z2) // edges glow brighter, like the reference
    // plasma streaks: a slow field on the surface modulates brightness, not shape
    const streak = Math.max(0, Math.sin(px * 4 + py * 3 + t * 0.0009) * Math.cos(pz * 5 - t * 0.0006))
    const lift = rim * 0.6 + streak * 0.8
    const alpha = 0.12 + depth * 0.35 + lift * 0.45
    if (colors) {
      const [r, gr, b] = colors[k]!
      const dim = focus == null || focus === k ? 1 : 0.1
      ctx.fillStyle = `rgba(${r + (255 - r) * lift * 0.3},${gr + (255 - gr) * lift * 0.3},${b + (255 - b) * lift * 0.3},${alpha * dim})`
    }
    else {
      ctx.fillStyle = `rgba(${90 + lift * 150},${90 + lift * 150},255,${alpha})`
    }
    const s = 0.6 + depth * 1.2
    ctx.fillRect(cx + x1 * R, cy + y1 * R, s, s)
  }
  ctx.globalCompositeOperation = 'source-over'
})
</script>

<template>
  <canvas ref="canvas" class="sphere" aria-hidden="true" @pointermove="onMove" />
</template>

<style scoped>
.sphere { width: 100%; height: 100%; }
</style>
