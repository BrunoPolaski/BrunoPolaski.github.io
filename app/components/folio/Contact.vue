<script setup lang="ts">
/**
 * Contact form. Email goes out through EmailJS (the HTML layout is emails/contact.html,
 * pasted into the EmailJS template); WhatsApp opens a chat with the message typed in,
 * in the visitor's language. Anything not configured degrades: no EmailJS keys → the
 * visitor's mail app, no WhatsApp number → that option is hidden.
 */
const props = defineProps<{ email: string }>()
const { t, locale } = useLocale()
const { whatsapp, emailjs } = useRuntimeConfig().public

type Channel = 'email' | 'whatsapp'
const channels = computed<Channel[]>(() => whatsapp ? ['email', 'whatsapp'] : ['email'])
const channel = ref<Channel>('email')
// UiSegmented speaks in labels; map them back to keys so switching language keeps the pick
const channelLabel = computed({
  get: () => t.value.contact.channels[channel.value],
  set: (label: string) => { channel.value = channels.value.find(c => t.value.contact.channels[c] === label) ?? 'email' },
})

const form = reactive({ name: '', email: '', message: '', company: '' }) // company: a honeypot only bots fill in
const status = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')
watch(channel, () => { status.value = 'idle' }) // a result belongs to the channel it came from

async function submit() {
  const vars = { name: form.name.trim(), message: form.message.trim() }
  if (form.company) { // a bot: pretend it worked
    status.value = 'sent'
    return
  }
  if (channel.value === 'whatsapp') {
    window.open(whatsappUrl(whatsapp, fill(t.value.contact.whatsappText, vars)), '_blank', 'noopener')
    return
  }
  const subject = fill(t.value.contact.subject, vars)
  if (!emailjs.publicKey) {
    location.href = `mailto:${props.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(vars.message)}`
    return
  }
  status.value = 'sending'
  try {
    await $fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      body: {
        service_id: emailjs.serviceId,
        template_id: emailjs.templateId,
        user_id: emailjs.publicKey,
        template_params: {
          subject,
          from_name: vars.name,
          reply_to: form.email.trim(),
          message: vars.message,
          locale: locale.value,
          sent_at: new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeStyle: 'short' }).format(new Date()),
        },
      },
    })
    status.value = 'sent'
    Object.assign(form, { name: '', email: '', message: '' })
  }
  catch {
    status.value = 'failed'
  }
}
</script>

<template>
  <form class="cform" @submit.prevent="submit">
    <div v-if="channels.length > 1" class="cform__via">
      <span>{{ t.contact.via }}</span>
      <UiSegmented v-model="channelLabel" :options="channels.map(c => t.contact.channels[c])" :label="t.contact.via" />
    </div>

    <div class="cform__row">
      <UiInput v-model="form.name" :label="t.contact.name" autocomplete="name" required />
      <UiInput v-if="channel === 'email'" v-model="form.email" :label="t.contact.email" type="email" autocomplete="email" required />
    </div>
    <UiInput v-model="form.message" :label="t.contact.message" :placeholder="t.contact.messageHint" :rows="5" required />
    <input v-model="form.company" class="cform__trap" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">

    <UiAlert v-if="status === 'sent'" :title="t.contact.sent" tone="good" />
    <UiAlert v-else-if="status === 'failed'" :title="t.contact.failed" tone="critical">
      {{ t.contact.failedHint }} <a :href="`mailto:${email}`">{{ email }}</a>.
    </UiAlert>

    <div class="cform__foot">
      <UiButton
        type="submit"
        variant="solid"
        size="lg"
        :loading="status === 'sending'"
        :icon-right="channel === 'whatsapp' ? 'lucide:message-circle' : 'lucide:send'"
      >
        {{ channel === 'whatsapp' ? t.contact.openWhatsapp : t.contact.send }}
      </UiButton>
      <p class="muted">{{ t.contact.or }} <a :href="`mailto:${email}`">{{ email }}</a></p>
    </div>
  </form>
</template>

<style scoped>
.cform { position: relative; align-self: stretch; display: flex; flex-direction: column; gap: var(--s-4); max-width: 760px; }
.cform__via { display: flex; align-items: center; gap: var(--s-3); font-size: var(--fs-sm); color: var(--ink-2); }
.cform__row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--s-4); }
.cform__foot { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-4); }
.cform__foot p { font-size: var(--fs-sm); overflow-wrap: anywhere; }
.cform a { color: var(--ink); }
/* off-screen instead of display:none, which some bots skip */
.cform__trap { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
</style>
