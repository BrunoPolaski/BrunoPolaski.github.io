<script setup lang="ts">
const form = reactive({ name: '', email: '', plan: 'Team', notify: true, terms: false, billing: 'monthly' })
const emailError = computed(() => form.email && !/^\S+@\S+\.\S+$/.test(form.email) ? 'Enter an email like name@company.com' : undefined)
const { push } = useToast()
function save() {
  if (emailError.value || !form.name) return push('Add a name and a valid email to save', 'critical')
  push(`Workspace for ${form.name} saved`, 'good')
}
</script>

<template>
  <DocsPage title="Forms" lead="Fields are native inputs with a label, a hint and an error slot wired to aria-describedby.">
    <DocsDemo title="Create a workspace" usage='<UiInput v-model="email" label="Email" :error="emailError" />'>
      <form class="form" novalidate @submit.prevent="save">
        <UiInput v-model="form.name" label="Workspace name" icon="lucide:building-2" placeholder="Acme Studio" hint="Shown on invoices" />
        <UiInput v-model="form.email" label="Billing email" type="email" icon="lucide:mail" placeholder="billing@acme.com" :error="emailError" />
        <UiSelect v-model="form.plan" label="Plan" :options="['Starter', 'Team', 'Enterprise']" />
        <fieldset class="form__set">
          <legend>Billing cycle</legend>
          <UiCheckbox v-model="form.billing" type="radio" name="billing" value="monthly" label="Monthly" />
          <UiCheckbox v-model="form.billing" type="radio" name="billing" value="yearly" label="Yearly, two months free" />
        </fieldset>
        <UiSwitch v-model="form.notify" label="Email me when an invoice is paid" />
        <UiCheckbox v-model="form.terms" label="I accept the terms of service" />
        <div class="row">
          <UiButton variant="solid" type="submit" :disabled="!form.terms">Save workspace</UiButton>
          <UiButton variant="ghost">Cancel</UiButton>
        </div>
      </form>
    </DocsDemo>
  </DocsPage>
</template>

<style scoped>
.form { display: grid; gap: var(--s-4); max-width: 440px; }
.form__set { display: flex; flex-direction: column; gap: 8px; border: 0; padding: 0; margin: 0; }
.form__set legend { font-size: var(--fs-sm); font-weight: 600; margin-bottom: 6px; }
</style>
