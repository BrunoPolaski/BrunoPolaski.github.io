<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const loading = ref(false)
const view = ref('Layout')
const { push } = useToast()
function recalc() {
  loading.value = true
  setTimeout(() => { loading.value = false; push('Totals recalculated', 'good') }, 1200)
}
</script>

<template>
  <DocsPage title="Buttons" lead="Four variants and five sizes. Solid is for the one action a view is about; outline is the everyday default.">
    <DocsDemo title="Sizes" usage='<UiButton size="lg" variant="solid" icon="lucide:filter">Filter</UiButton>'>
      <div class="stack">
        <div v-for="s in sizes" :key="s" class="row">
          <UiButton :size="s" variant="solid" icon="lucide:filter">Filter</UiButton>
          <UiButton :size="s" variant="soft" icon="lucide:scale">Legal</UiButton>
          <UiButton :size="s" icon="lucide:file-output">Export</UiButton>
          <UiButton :size="s" variant="ghost" icon="lucide:chart-column">Reports</UiButton>
          <UiButton :size="s" icon="lucide:settings" label="Settings" />
        </div>
      </div>
    </DocsDemo>
    <DocsDemo title="States" usage='<UiButton :loading="saving" variant="solid">Recalculate</UiButton>'>
      <div class="row">
        <UiButton variant="solid" icon="lucide:refresh-cw" :loading="loading" @click="recalc">Recalculate</UiButton>
        <UiButton disabled>Disabled</UiButton>
        <UiButton to="/halo/forms" icon-right="lucide:arrow-up-right">As a link</UiButton>
        <UiTooltip text="Icon-only buttons need a label"><UiButton icon="lucide:bell" label="Alerts" /></UiTooltip>
      </div>
    </DocsDemo>
    <DocsDemo title="Segmented control" usage='<UiSegmented v-model="view" label="View" :options="[...]" />'>
      <UiSegmented v-model="view" label="View" :options="['Theme', 'Icons', 'Colors', 'Components', 'Layout']" />
    </DocsDemo>
    <DocsDemo title="Menu" usage="Native popover API: light dismiss and Escape come free.">
      <UiMenu label="Actions" :items="[{ label: 'Duplicate', icon: 'lucide:copy' }, { label: 'Share', icon: 'lucide:share' }, { label: 'Archive', icon: 'lucide:archive' }]" @select="push(`${$event} selected`)" />
    </DocsDemo>
  </DocsPage>
</template>

