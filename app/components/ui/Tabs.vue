<script setup lang="ts">
const props = defineProps<{ tabs: string[] }>()
const active = ref(props.tabs[0])
const id = useId()

function move(e: KeyboardEvent, i: number) {
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  const next = (i + step + props.tabs.length) % props.tabs.length
  active.value = props.tabs[next]
  ;((e.currentTarget as HTMLElement).parentElement?.children[next] as HTMLElement | undefined)?.focus()
}
</script>

<template>
  <div>
    <div class="tabs" role="tablist">
      <button
        v-for="(t, i) in tabs"
        :id="`${id}-t${i}`"
        :key="t"
        role="tab"
        type="button"
        :aria-selected="active === t"
        :aria-controls="`${id}-p`"
        :tabindex="active === t ? 0 : -1"
        @click="active = t"
        @keydown="move($event, i)"
      >
        {{ t }}
      </button>
    </div>
    <div :id="`${id}-p`" role="tabpanel" class="tabs__panel" :aria-labelledby="`${id}-t${tabs.indexOf(active!)}`">
      <slot :name="active" />
    </div>
  </div>
</template>

<style scoped>
.tabs { display: flex; gap: var(--s-5); border-bottom: 1px solid var(--line); overflow-x: auto; }
.tabs button {
  padding: 10px 0;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: none;
  font-weight: 600;
  color: var(--ink-3);
  cursor: pointer;
  white-space: nowrap;
}
.tabs button[aria-selected='true'] { color: var(--ink); border-color: var(--ink); }
.tabs__panel { padding-top: var(--s-4); }
</style>
