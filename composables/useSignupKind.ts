import type { PageKind } from '~/types/api'

const STORAGE_KEY = 'll_signup_kind'

/**
 * Guarda que a pessoa veio pelo caminho gamer (`?kind=gamer`), para o onboarding
 * já sugerir um perfil gamer depois do cadastro e da confirmação de e-mail.
 */
export function useSignupKind() {
  function read(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }

  function capture(query: Record<string, unknown>): void {
    if (!import.meta.client || query.kind !== 'gamer') return
    try {
      localStorage.setItem(STORAGE_KEY, 'gamer')
    } catch {
      // Sem armazenamento, o onboarding só não vem pré-selecionado.
    }
  }

  function get(): PageKind {
    if (!import.meta.client) return 'standard'
    return read() === 'gamer' ? 'gamer' : 'standard'
  }

  function clear(): void {
    if (!import.meta.client) return
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nada a limpar.
    }
  }

  return { capture, get, clear }
}
