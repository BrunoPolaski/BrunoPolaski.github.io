/** Public, non-fork repo count per language. Cached: unauthenticated GitHub allows 60 requests/hour. */
export default defineCachedEventHandler(async () => {
  const { githubToken } = useRuntimeConfig()
  const repos = await $fetch<{ fork: boolean, language: string | null }[]>(
    'https://api.github.com/users/BrunoPolaski/repos?per_page=100',
    { headers: { 'User-Agent': 'bruno-polaski-portfolio', ...(githubToken && { Authorization: `Bearer ${githubToken}` }) } },
  )
  const counts: Record<string, number> = {}
  for (const r of repos) {
    if (!r.fork && r.language) counts[r.language] = (counts[r.language] ?? 0) + 1
  }
  return counts
}, { maxAge: 60 * 60 * 6, name: 'github-languages' })
