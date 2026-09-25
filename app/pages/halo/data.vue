<script setup lang="ts">
const columns = [
  { key: 'id', label: 'Invoice' },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'owner', label: 'Owner', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'amount', label: 'Amount', align: 'right' as const, sortable: true },
]
const money = (n: number) => n.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
</script>

<template>
  <DocsPage title="Data display" lead="Tables, cards, stat tiles, avatars and badges for dense, scannable screens.">
    <DocsDemo title="Table" usage='<UiTable caption="Invoices" :columns="columns" :rows="rows"><template #cell-amount="{ row }">…</template></UiTable>'>
      <UiTable caption="Invoices" :columns="columns" :rows="invoices" :page-size="5">
        <template #cell-owner="{ row }">
          <span class="row owner"><UiAvatar :name="String(row.owner)" :size="24" />{{ row.owner }}</span>
        </template>
        <template #cell-status="{ row }">
          <UiBadge :tone="statusTone[row.status as 'Paid']" :icon="statusIcon[row.status as 'Paid']">{{ row.status }}</UiBadge>
        </template>
        <template #cell-amount="{ row }">{{ money(Number(row.amount)) }}</template>
      </UiTable>
    </DocsDemo>
    <DocsDemo title="Stat tiles" usage='<UiStat label="Active clients" :value="1284" :delta="3.1" :trend="[...]" />'>
      <div class="grid-auto">
        <UiStat label="Active clients" :value="1284" :delta="3.1" :trend="[1100, 1120, 1150, 1170, 1200, 1210, 1240, 1262, 1284]" />
        <UiStat label="Churned" :value="18" :delta="-12" />
      </div>
    </DocsDemo>
    <DocsDemo title="Cards">
      <div class="grid-auto">
        <UiCard title="Text-to-speech" subtitle="Record 12 of 56">
          <template #actions><UiButton size="sm" variant="ghost" icon="lucide:ellipsis" label="More" /></template>
          <p class="muted">00:12:34 recorded. Captions are generated when you stop.</p>
          <template #footer>
            <div class="row"><UiButton size="sm" variant="solid" icon="lucide:mic">Record</UiButton><UiButton size="sm" icon="lucide:square">Stop</UiButton></div>
          </template>
        </UiCard>
        <UiCard tone="ink" title="Back to Black" subtitle="Amy Winehouse, 2006">
          <UiProgress :value="38" label="1:34 of 4:01" />
        </UiCard>
        <UiCard title="Loading state">
          <div class="row"><UiSkeleton width="40px" height="40px" round /><div class="stack sk-lines"><UiSkeleton width="60%" /><UiSkeleton width="90%" /></div></div>
        </UiCard>
      </div>
    </DocsDemo>
    <DocsDemo title="Avatars and badges">
      <div class="row">
        <UiAvatar name="James Lewis" />
        <UiAvatar name="Ana Souza" :size="44" />
        <UiBadge>Draft</UiBadge>
        <UiBadge tone="solid">New</UiBadge>
        <UiBadge tone="good" icon="lucide:circle-check">Paid</UiBadge>
      </div>
    </DocsDemo>
  </DocsPage>
</template>

<style scoped>
.owner { gap: 8px; flex-wrap: nowrap; }
.sk-lines { flex: 1; gap: 8px; }
</style>
