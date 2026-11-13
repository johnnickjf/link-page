import type { MaybeRefOrGetter } from 'vue'

const SEEN_KEY = 'll_seen'

/**
 * Registro leve de "já contei hoje", no próprio aparelho do visitante: evita
 * requisições repetidas e não sai daqui. Uma chave só, recriada a cada dia,
 * sem crescer. Sem localStorage (aba anônima, bloqueio), segue sem ele: o
 * servidor também deduplica.
 */
function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed?.day === new Date().toDateString() && Array.isArray(parsed.ids) ? parsed.ids : []
  } catch {
    return []
  }
}

function markSeen(id: string): void {
  try {
    const seen = readSeen()
    if (seen.includes(id)) return
    localStorage.setItem(SEEN_KEY, JSON.stringify({ day: new Date().toDateString(), ids: [...seen, id] }))
  } catch {
    // Sem armazenamento: o servidor deduplica sozinho.
  }
}

/**
 * Contagem de visitas e cliques da página pública. Nunca atrapalha o visitante:
 * roda só no navegador (crawlers sem JS não contam), não bloqueia a navegação e
 * ignora qualquer falha. O token, quando existe, serve apenas para o backend
 * não contar o dono vendo a própria página.
 *
 * A marca local só é gravada depois que o servidor confirma: se a requisição
 * falhar, a próxima tentativa conta. Com alguém logado ela nem é usada, porque o
 * servidor pode ignorar o envio (o dono vendo a própria página) e a marca
 * impediria a contagem depois de sair da conta.
 */
export function usePublicTracking(slug: MaybeRefOrGetter<string>) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  function send(path: string, seenId: string): void {
    const loggedIn = Boolean(auth.token)
    if (!loggedIn && readSeen().includes(seenId)) return
    try {
      // A base pode vir com barra no fim, como em produção: `//public` responde 404.
      const api = config.public.apiBase.replace(/\/+$/, '')
      const base = `${api}/public/${encodeURIComponent(toValue(slug))}`
      fetch(`${base}${path}`, {
        method: 'POST',
        keepalive: true,
        headers: loggedIn ? { Authorization: `Bearer ${auth.token}` } : undefined,
      })
        .then((res) => {
          if (res.ok && !loggedIn) markSeen(seenId)
        })
        .catch(() => {})
    } catch {
      // Contar é secundário.
    }
  }

  function trackVisit(): void {
    send('/hit', `v:${toValue(slug)}`)
  }

  /**
   * Delegado no root do template: qualquer link/botão dentro de um bloco. Precisa
   * rodar na captura: um bloco pode se trocar ao receber o clique (o player sai
   * do botão para o iframe), e depois disso o alvo já não está mais na página.
   */
  function onClick(event: Event): void {
    const target = event.target as Element | null
    if (!target?.closest?.('a, button')) return
    const id = target.closest('[data-block-id]')?.getAttribute('data-block-id')
    if (id) send(`/click/${encodeURIComponent(id)}`, `c:${id}`)
  }

  return { trackVisit, onClick }
}
