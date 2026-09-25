/** Portfolio locales, main one first: it is also the fallback. */
export const localeCodes = ['pt-BR', 'en', 'es'] as const
export type Locale = typeof localeCodes[number]

export const isLocale = (v: unknown): v is Locale => localeCodes.includes(v as Locale)

/** Picks the first supported language from an Accept-Language header, by primary subtag (pt-PT → pt-BR). */
export function detectLocale(header = ''): Locale {
  for (const tag of header.split(',')) {
    const primary = tag.split(';')[0]!.trim().toLowerCase().split('-')[0]
    const hit = localeCodes.find(l => l.toLowerCase().split('-')[0] === primary)
    if (hit) return hit
  }
  return localeCodes[0]
}
