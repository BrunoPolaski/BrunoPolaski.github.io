<script setup lang="ts">
const props = withDefaults(defineProps<{ cell?: number }>(), { cell: 14 })
const canvas = ref<HTMLCanvasElement>()
const pointer = { x: -999, y: -999 }
let heat = new Float32Array(0)
let cols = 0

function onMove(e: PointerEvent) {
  const b = canvas.value!.getBoundingClientRect()
  pointer.x = e.clientX - b.left
  pointer.y = e.clientY - b.top
}

useCanvasLoop(canvas, (ctx, w, h, t) => {
  const c = props.cell
  cols = Math.ceil(w / c)
  const rows = Math.ceil(h / c)
  if (heat.length !== cols * rows) heat = new Float32Array(cols * rows)
  const ink = getComputedStyle(canvas.value!).color
  ctx.clearRect(0, 0, w, h)
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const i = r * cols + q
      const d = Math.hypot(q * c + c / 2 - pointer.x, r * c + c / 2 - pointer.y)
      heat[i] = Math.max(heat[i]! * 0.94, d < 70 ? 1 - d / 70 : 0)
      const idle = 0.08 + 0.06 * Math.sin(q * 0.4 + r * 0.3 + t * 0.002)
      const v = Math.max(idle, heat[i]!)
      ctx.globalAlpha = v
      ctx.fillStyle = heat[i]! > idle ? 'rgb(70,70,255)' : ink
      const s = (c - 3) * (0.5 + v * 0.5)
      ctx.fillRect(q * c + (c - s) / 2, r * c + (c - s) / 2, s, s)
    }
  }
  ctx.globalAlpha = 1
})
</script>

<template>
  <canvas ref="canvas" class="pgrid" aria-hidden="true" @pointermove="onMove" @pointerleave="pointer.x = -999" />
</template>

<style scoped>
.pgrid { width: 100%; height: 100%; color: var(--ink); }
</style>
