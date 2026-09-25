/** Replaces {key} placeholders in a translated template; unknown keys are left as they are. */
export function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m)
}

/**
 * wa.me link that opens a chat with `number` (any format; only digits are kept) and `text` typed in.
 * Takes a number too: Nuxt parses an all-digit NUXT_PUBLIC_WHATSAPP into one.
 */
export function whatsappUrl(number: string | number, text: string) {
  return `https://wa.me/${String(number).replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}
