<script setup lang="ts">
const signups = [320, 410, 380, 520, 610, 580, 720, 690, 840]
const range = ref('9 months')
</script>

<template>
  <DocsPage title="Charts" lead="Dependency-free SVG charts. They follow one axis, thin marks, and a legend whenever there are two or more series. Hover any chart for exact values.">
    <UiSegmented v-model="range" label="Time range" :options="['3 months', '9 months']" />
    <div class="charts">
      <UiCard>
        <ChartLine
          title="Revenue by stream, USD"
          :labels="range === '9 months' ? months : months.slice(-3)"
          :series="revenue.map(s => ({ ...s, values: range === '9 months' ? s.values : s.values.slice(-3) }))"
        />
      </UiCard>
      <UiCard>
        <ChartLine title="New signups" :labels="months" :series="[{ name: 'Signups', values: signups }]" :height="220" />
      </UiCard>
      <UiCard>
        <ChartBar title="Invoices sent per month" :labels="months" :values="[42, 38, 51, 47, 60, 55, 64, 58, 71]" />
      </UiCard>
      <UiCard>
        <ChartDonut title="Revenue mix, September" :items="revenue.map(s => ({ name: s.name, value: s.values.at(-1)! }))" />
      </UiCard>
    </div>
  </DocsPage>
</template>

<style scoped>
.charts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: var(--s-4); margin-top: calc(-1 * var(--s-5)); }
</style>
