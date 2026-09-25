<script setup lang="ts">
defineProps<{ label: string, items: { label: string, icon?: string }[] }>()
const emit = defineEmits<{ select: [label: string] }>()
const id = useId()
</script>

<template>
  <div class="menu">
    <UiButton :popovertarget="id" icon-right="lucide:chevron-down">{{ label }}</UiButton>
    <!-- ponytail: native popover, no auto-flip; add anchor positioning if menus hit viewport edges -->
    <div :id="id" popover class="menu__pop acrylic" role="menu">
      <button
        v-for="it in items"
        :key="it.label"
        type="button"
        role="menuitem"
        :popovertarget="id"
        popovertargetaction="hide"
        @click="emit('select', it.label)"
      >
        <Icon v-if="it.icon" :name="it.icon" /> {{ it.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.menu { position: relative; anchor-scope: all; }
.menu__pop {
  inset: auto;
  margin: 6px 0 0;
  min-width: 180px;
  padding: 4px;
  border-radius: 10px;
  color: var(--ink);
  position-area: bottom span-right;
}
.menu__pop button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 6px;
  background: none;
  text-align: left;
  font-size: var(--fs-sm);
  cursor: pointer;
}
.menu__pop button:hover, .menu__pop button:focus-visible { background: var(--wash); outline: 0; }
</style>
