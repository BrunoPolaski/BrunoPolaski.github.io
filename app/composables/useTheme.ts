export type Theme = 'system' | 'light' | 'dark'

/** Cookie-backed so SSR renders the right data-theme with no flash. */
export function useTheme() {
  const theme = useCookie<Theme>('theme', { default: () => 'system', maxAge: 60 * 60 * 24 * 365 })
  useHead({ htmlAttrs: { 'data-theme': () => (theme.value === 'system' ? undefined : theme.value) } })
  return theme
}
