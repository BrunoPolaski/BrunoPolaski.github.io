<script setup lang="ts" generic="Row extends Record<string, unknown>">
export interface Column {
  key: string
  label: string
  align?: 'left' | 'right'
  sortable?: boolean
}

const props = withDefaults(defineProps<{ columns: Column[], rows: Row[], pageSize?: number, caption: string }>(), { pageSize: 5 })

const sortKey = ref<string>()
const dir = ref<1 | -1>(1)
const page = ref(1)

function sortBy(key: string) {
  if (sortKey.value === key) dir.value = dir.value === 1 ? -1 : 1
  else { sortKey.value = key; dir.value = 1 }
}

const sorted = computed(() => {
  const k = sortKey.value
  if (!k) return props.rows
  return [...props.rows].sort((a, b) => {
    const x = a[k], y = b[k]
    return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * dir.value
  })
})
const pages = computed(() => Math.max(1, Math.ceil(props.rows.length / props.pageSize)))
const visible = computed(() => sorted.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize))
const ariaSort = (k: string) => sortKey.value !== k ? 'none' : dir.value === 1 ? 'ascending' : 'descending'
</script>

<template>
  <div class="tbl">
    <div class="tbl__scroll">
      <table>
        <caption class="sr-only">{{ caption }}</caption>
        <thead>
          <tr>
            <th v-for="c in columns" :key="c.key" :aria-sort="c.sortable ? ariaSort(c.key) : undefined" :style="{ textAlign: c.align ?? 'left' }">
              <button v-if="c.sortable" type="button" @click="sortBy(c.key)">
                {{ c.label }}
                <Icon :name="sortKey !== c.key ? 'lucide:chevrons-up-down' : dir === 1 ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
              </button>
              <template v-else>{{ c.label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in visible" :key="i">
            <td v-for="c in columns" :key="c.key" :style="{ textAlign: c.align ?? 'left' }">
              <slot :name="`cell-${c.key}`" :row="r">{{ r[c.key] }}</slot>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td :colspan="columns.length" class="tbl__empty">No rows yet. Add one to see it here.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <UiPagination v-if="pages > 1" v-model="page" :pages="pages" :total="rows.length" />
  </div>
</template>

<style scoped>
.tbl { display: flex; flex-direction: column; gap: var(--s-4); }
.tbl__scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); font-variant-numeric: tabular-nums; }
th {
  padding: 10px 12px;
  border-bottom: 1px solid var(--line-strong);
  color: var(--ink-3);
  font-weight: 600;
  white-space: nowrap;
}
th button { display: inline-flex; align-items: center; gap: 4px; border: 0; padding: 0; background: none; font-weight: 600; color: inherit; cursor: pointer; }
td { padding: 12px; border-bottom: 1px solid var(--line); white-space: nowrap; }
tbody tr:hover { background: var(--surface-sunken); }
.tbl__empty { text-align: center; color: var(--ink-3); padding: 32px; }
</style>
