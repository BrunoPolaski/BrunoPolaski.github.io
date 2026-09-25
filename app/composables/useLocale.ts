import ptBR, { type Messages } from '~/i18n/pt-BR'
import en from '~/i18n/en'
import es from '~/i18n/es'

const messages: Record<Locale, Messages> = { 'pt-BR': ptBR, en, es }

/**
 * Portfolio language: the visitor's saved choice, else their browser's Accept-Language, else pt-BR.
 * Resolved on the server when there is one (first paint already right); on a static host,
 * `syncFromBrowser()` corrects it after hydration.
 * `t` is the typed message tree: `t.about.title`, not string keys.
 */
export function useLocale() {
  const saved = useCookie<string | undefined>('locale', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  const header = useRequestHeaders(['accept-language'])['accept-language']
  const resolve = (accept?: string) => isLocale(saved.value) ? saved.value : detectLocale(accept)
  const locale = useState<Locale>('locale', () => resolve(header))
  const t = computed(() => messages[locale.value])
  function setLocale(l: Locale) {
    locale.value = l
    saved.value = l // only an explicit pick is remembered; otherwise the browser language keeps deciding
  }
  /**
   * For prerendered (static) pages, where no request reached a server: the HTML was built
   * in pt-BR, so re-resolve from the cookie and the browser's own languages after hydration.
   */
  function syncFromBrowser() {
    locale.value = resolve(navigator.languages.join(','))
  }
  return { locale, t, setLocale, syncFromBrowser }
}
