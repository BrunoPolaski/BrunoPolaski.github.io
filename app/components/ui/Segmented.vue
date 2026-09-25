<script setup lang="ts">
defineProps<{ options: string[], label: string }>()
const model = defineModel<string>({ required: true })

// the selection is one thumb that slides to the pressed button; measured, since labels differ in width
const root = ref<HTMLElement>()
const thumb = reactive({ x: 0, w: 0, ready: false })
function place() {
  const on = root.value?.querySelector<HTMLElement>('button[aria-pressed="true"]')
  if (!on) return
  thumb.x = on.offsetLeft
  thumb.w = on.offsetWidth
}
let ro: ResizeObserver | undefined
onMounted(() => {
  place()
  ro = new ResizeObserver(place) // labels change width with the language
  ro.observe(root.value!)
  for (const b of root.value!.querySelectorAll('button')) ro.observe(b)
  requestAnimationFrame(() => { thumb.ready = true }) // no slide in from 0 on first paint
})
onBeforeUnmount(() => ro?.disconnect())
watch(model, () => nextTick(place))
</script>

<template>
  <div ref="root" class="seg" role="group" :aria-label="label">
    <span class="seg__thumb" :class="{ 'is-ready': thumb.ready }" :style="{ translate: `${thumb.x}px 0`, width: `${thumb.w}px` }" aria-hidden="true" />
    <button
      v-for="o in options"
      :key="o"
      type="button"
      :aria-pressed="model === o"
      @click="model = o"
    >
      {{ o }}
    </button>
  </div>
</template>

<style scoped>
.seg { position: relative; display: inline-flex; align-self: flex-start; gap: 2px; padding: 3px; border-radius: 10px; background: var(--wash); max-width: 100%; overflow-x: auto; }
.seg__thumb { position: absolute; top: 3px; bottom: 3px; left: 0; border-radius: 7px; background: var(--ink); }
.seg__thumb.is-ready { transition: translate 0.35s var(--ease), width 0.35s var(--ease); }
.seg button {
  position: relative; /* above the thumb */
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 7px;
  background: none;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--ink-2);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.35s var(--ease);
}
.seg button[aria-pressed='true'] { color: var(--on-ink); }
/* before hydration there is no thumb position yet: paint the pressed button itself */
.seg:not(:has(.is-ready)) button[aria-pressed='true'] { background: var(--ink); }
</style>
