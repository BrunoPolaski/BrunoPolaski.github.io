<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
  error?: string
  icon?: string
  type?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  /** Renders a multi-line textarea this many rows tall. */
  rows?: number
}>()
const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="field">
    <label :for="id" class="field__label">{{ label }}</label>
    <div :class="['field__box', { 'field__box--error': error, 'field__box--multi': rows }]">
      <Icon v-if="icon" :name="icon" class="field__icon" />
      <textarea
        v-if="rows"
        :id="id"
        v-model="model"
        :rows="rows"
        :placeholder="placeholder"
        :required="required"
        :aria-invalid="!!error || undefined"
        :aria-describedby="error || hint ? `${id}-msg` : undefined"
      />
      <input
        v-else
        :id="id"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="!!error || undefined"
        :aria-describedby="error || hint ? `${id}-msg` : undefined"
      >
    </div>
    <p v-if="error || hint" :id="`${id}-msg`" :class="error ? 'field__error' : 'field__hint'">
      <Icon v-if="error" name="lucide:circle-alert" /> {{ error ?? hint }}
    </p>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 6px; }
.field__label { font-size: var(--fs-sm); font-weight: 600; }
.field__box {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-control);
  background: var(--surface);
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.field__box:focus-within { border-color: var(--ink); box-shadow: 0 0 0 3px var(--signal-soft); }
.field__box--error { border-color: var(--critical); }
.field__box input, .field__box textarea { flex: 1; min-width: 0; border: 0; outline: 0; background: none; height: 100%; color: inherit; font: inherit; }
.field__box--multi { height: auto; align-items: flex-start; padding: 8px 12px; }
.field__box textarea { resize: vertical; line-height: 1.5; }
.field__icon { color: var(--ink-3); }
.field__hint, .field__error { font-size: var(--fs-xs); display: flex; align-items: center; gap: 4px; }
.field__hint { color: var(--ink-3); }
.field__error { color: var(--critical); }
</style>
