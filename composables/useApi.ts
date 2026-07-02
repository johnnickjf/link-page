import type { FetchError } from 'ofetch'
import type { ApiErrorBody, AuthToken } from '~/types/api'

type ApiRequestOptions = NonNullable<Parameters<typeof $fetch>[1]>

/**
 * Extrai uma mensagem legível do erro da API para exibir na UI.
 * Cobre `{ error }` (seção 4) e `{ message }` / `{ detail }` (FastAPI).
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.',
): string {
  const data = (error as FetchError<ApiErrorBody>)?.data
  if (data) {
    if (typeof data.error === 'string') return data.error
    if (typeof data.message === 'string') return data.message
    if (typeof data.detail === 'string') return data.detail
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      return data.detail.map((d) => d.msg).join(', ')
    }
  }
  const message = (error as FetchError)?.statusMessage
  return message || fallback
}

// Dedup de refresh: uma tentativa por vez, isolada por requisição (chaveada pelo
// nuxtApp — no SSR cada request tem o seu, sem vazar token entre usuários).
const refreshInflight = new WeakMap<object, Promise<boolean>>()

/**
 * Wrapper sobre `$fetch` (seção 4):
 * - injeta base URL (`apiBase`) e `Authorization: Bearer <token>`;
 * - em 401, tenta `POST /auth/refresh` UMA vez e refaz a request; se falhar,
 *   desloga e manda pro login;
 * - erros 400/403/409/422 são propagados para a UI exibir a mensagem da API.
 */
export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const nuxtApp = useNuxtApp()

  function withAuthHeaders(init?: HeadersInit): Headers {
    const headers = new Headers(init)
    if (auth.token) headers.set('Authorization', `Bearer ${auth.token}`)
    return headers
  }

  async function tryRefresh(): Promise<boolean> {
    if (!auth.token) return false
    try {
      // /auth/refresh renova o token do usuário logado via Bearer, sem body.
      const data = await $fetch<AuthToken>('/auth/refresh', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: withAuthHeaders(),
      })
      auth.setToken(data)
      return true
    } catch {
      return false
    }
  }

  function refresh(): Promise<boolean> {
    let inflight = refreshInflight.get(nuxtApp)
    if (!inflight) {
      inflight = tryRefresh().finally(() => refreshInflight.delete(nuxtApp))
      refreshInflight.set(nuxtApp, inflight)
    }
    return inflight
  }

  async function request<T>(
    url: string,
    opts: ApiRequestOptions = {},
    retry = true,
  ): Promise<T> {
    try {
      // Cast explícito: os módulos de SEO registram rotas Nitro tipadas
      // (ex.: /sitemap.xml), o que faz o TS inferir um tipo de retorno
      // condicional para `$fetch` em vez do genérico `T` deste wrapper.
      return (await $fetch<T>(url, {
        baseURL: config.public.apiBase,
        ...opts,
        headers: withAuthHeaders(opts.headers),
      })) as T
    } catch (error) {
      const status = (error as FetchError).statusCode
      if (status === 401 && retry && url !== '/auth/refresh') {
        const ok = await refresh()
        if (ok) return request<T>(url, opts, false)
        auth.clear()
        if (import.meta.client) await navigateTo('/login')
      }
      throw error
    }
  }

  return { request, refresh }
}
