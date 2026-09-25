<script setup lang="ts">
const props = withDefaults(defineProps<{ count?: number, speed?: number }>(), { count: 5200, speed: 1 })

const canvas = ref<HTMLCanvasElement>()
const tilt = { x: 0, y: 0 }

// Fibonacci sphere: evenly spread points, no clustering at the poles.
const golden = Math.PI * (3 - Math.sqrt(5))
const points = Array.from({ length: props.count }, (_, i) => {
  const y = 1 - (i / (props.count - 1)) * 2
  const r = Math.sqrt(1 - y * y)
  return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r] as const
})

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
  const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.25)
  g.addColorStop(0, 'rgba(60,60,255,0.18)')
  g.addColorStop(1, 'rgba(60,60,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'lighter'
  for (const [px, py, pz] of points) {
    const x1 = px * cosA - pz * sinA
    const z1 = px * sinA + pz * cosA
    const y1 = py * cosB - z1 * sinB
    const z2 = py * sinB + z1 * cosB
    const depth = (z2 + 1.2) / 2.2
    const rim = 1 - Math.abs(z2) // edges glow brighter, like the reference
    // plasma streaks: a slow field on the surface modulates brightness, not shape
    const streak = Math.max(0, Math.sin(px * 4 + py * 3 + t * 0.0009) * Math.cos(pz * 5 - t * 0.0006))
    const lift = rim * 0.6 + streak * 0.8
    ctx.fillStyle = `rgba(${90 + lift * 150},${90 + lift * 150},255,${0.12 + depth * 0.35 + lift * 0.45})`
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
