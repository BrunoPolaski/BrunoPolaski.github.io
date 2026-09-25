<script setup lang="ts">
const props = defineProps<{ pages: number, total?: number }>()
const page = defineModel<number>({ required: true })
const go = (p: number) => { page.value = Math.min(props.pages, Math.max(1, p || 1)) }
</script>

<template>
  <nav class="pag" aria-label="Pagination">
    <UiButton variant="ghost" size="sm" icon="lucide:chevrons-left" label="First page" :disabled="page === 1" @click="go(1)" />
    <UiButton variant="ghost" size="sm" icon="lucide:chevron-left" label="Previous page" :disabled="page === 1" @click="go(page - 1)" />
    <input
      :value="page"
      type="number"
      min="1"
      :max="pages"
      aria-label="Page"
      @change="go(Number(($event.target as HTMLInputElement).value))"
    >
    <span class="muted">of {{ pages }}</span>
    <UiButton variant="ghost" size="sm" icon="lucide:chevron-right" label="Next page" :disabled="page === pages" @click="go(page + 1)" />
    <UiButton variant="ghost" size="sm" icon="lucide:chevrons-right" label="Last page" :disabled="page === pages" @click="go(pages)" />
    <span v-if="total != null" class="muted pag__total">{{ total }} rows</span>
  </nav>
</template>

<style scoped>
.pag { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 4px; font-size: var(--fs-sm); }
.pag input {
  width: 52px;
  height: 30px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-control);
  background: var(--surface);
  text-align: center;
  -moz-appearance: textfield;
}
.pag input::-webkit-inner-spin-button { display: none; }
.pag__total { flex-basis: 100%; text-align: center; }
</style>
