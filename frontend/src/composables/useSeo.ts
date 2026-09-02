import { useHead } from '@unhead/vue'

const siteUrl = 'https://nickkampe.com'

export function useSeo(title: string, description: string, path = '/') {
  const canonical = `${siteUrl}${path === '/' ? '' : path}`
  useHead({
    title,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
  })
}
