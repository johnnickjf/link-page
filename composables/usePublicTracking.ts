import type { MaybeRefOrGetter } from 'vue'

const SEEN_KEY = 'll_seen'

/**
 * Registro leve de "já contei hoje", no próprio aparelho do visitante: evita
 * requisições repetidas e não sai daqui. Uma chave só, recriada a cada dia,
 * sem crescer. Sem localStorage (aba anônima, bloqueio), segue sem ele: o
 * servidor também deduplica.
 */
function firstTimeToday(id: string): boolean {
  try {
    const day = new Date().toDateString()
    const raw = localStorage.getItem(SEEN_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const seen: string[] = parsed?.day === day && Array.isArray(parsed.ids) ? parsed.ids : []
    if (seen.includes(id)) return false
    localStorage.setItem(SEEN_KEY, JSON.stringify({ day, ids: [...seen, id] }))
    return true
  } catch {
    return true
  }
}

/**
 * Contagem de visitas e cliques da página pública. Nunca atrapalha o visitante:
 * roda só no navegador (crawlers sem JS não contam), não bloqueia a navegação e
 * ignora qualquer falha. O token, quando existe, serve apenas para o backend
 * não contar o dono vendo a própria página.
 */
export function usePublicTracking(slug: MaybeRefOrGetter<string>) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  function send(path: string): void {
    try {
      const base = `${config.public.apiBase}/public/${encodeURIComponent(toValue(slug))}`
      fetch(`${base}${path}`, {
        method: 'POST',
        keepalive: true,
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined,
      }).catch(() => {})
    } catch {
      // Contar é secundário.
    }
  }

  function trackVisit(): void {
    if (firstTimeToday(`v:${toValue(slug)}`)) send('/hit')
  }

  /** Delegado no root do template: qualquer link/botão dentro de um bloco. */
  function onClick(event: Event): void {
    const target = event.target as Element | null
    if (!target?.closest?.('a, button')) return
    const id = target.closest('[data-block-id]')?.getAttribute('data-block-id')
    if (id && firstTimeToday(`c:${id}`)) send(`/click/${encodeURIComponent(id)}`)
  }

  return { trackVisit, onClick }
}
