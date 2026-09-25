interface FrameHooks {
  /** Return false to abort (e.g. no WebGL). */
  setup: (el: HTMLCanvasElement) => boolean
  resize: (w: number, h: number, dpr: number) => void
  frame: (t: number) => void
}

/**
 * Drives a canvas: DPR-aware resizing, rAF only while on screen.
 * Every resize also renders a still frame (t = 0), which is all that
 * runs under prefers-reduced-motion.
 */
export function useFrameLoop(canvas: Ref<HTMLCanvasElement | undefined>, hooks: FrameHooks, maxDpr = 2) {
  let raf = 0
  let visible = true
  const cleanups: (() => void)[] = []

  onMounted(() => {
    const el = canvas.value
    if (!el || !hooks.setup(el)) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, maxDpr)
      w = el.clientWidth
      h = el.clientHeight
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      hooks.resize(w, h, dpr)
      if (w && h) hooks.frame(0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting
      if (visible && !still) raf ||= requestAnimationFrame(frame)
    })
    io.observe(el)
    cleanups.push(() => ro.disconnect(), () => io.disconnect())

    function frame(t: number) {
      raf = 0
      if (!visible) return
      if (w && h) hooks.frame(t)
      raf = requestAnimationFrame(frame)
    }
    resize()
    if (!still) raf = requestAnimationFrame(frame)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    cleanups.forEach(fn => fn())
  })
}

/** 2D-canvas flavour: `draw` works in CSS pixels. */
export function useCanvasLoop(
  canvas: Ref<HTMLCanvasElement | undefined>,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
) {
  let ctx: CanvasRenderingContext2D | null = null
  let w = 0, h = 0
  useFrameLoop(canvas, {
    setup: el => !!(ctx = el.getContext('2d')),
    resize: (cw, ch, dpr) => {
      w = cw
      h = ch
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    },
    frame: t => draw(ctx!, w, h, t),
  })
}
