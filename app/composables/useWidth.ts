/** Tracks an element's content width so SVG charts render at true pixel size. */
export function useWidth(el: Ref<HTMLElement | undefined>, fallback = 600) {
  const width = ref(fallback)
  let ro: ResizeObserver | undefined
  onMounted(() => {
    ro = new ResizeObserver(([e]) => { if (e) width.value = e.contentRect.width })
    if (el.value) ro.observe(el.value)
  })
  onBeforeUnmount(() => ro?.disconnect())
  return width
}
