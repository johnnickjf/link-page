const STORAGE_KEY = 'll_referral_code'

/**
 * Captura `?referral_code=X` da URL (qualquer página) e guarda no
 * localStorage, pra sobreviver a navegações até a pessoa chegar no /register
 * — mesmo que ela veja a homepage antes e só se cadastre depois.
 */
export function useReferralCode() {
  function capture(query: Record<string, unknown>): void {
    if (!import.meta.client) return
    const raw = query.referral_code
    const code = Array.isArray(raw) ? raw[0] : raw
    if (typeof code === 'string' && code.trim()) {
      localStorage.setItem(STORAGE_KEY, code.trim().toUpperCase())
    }
  }

  function get(): string {
    if (!import.meta.client) return ''
    return localStorage.getItem(STORAGE_KEY) || ''
  }

  function clear(): void {
    if (!import.meta.client) return
    localStorage.removeItem(STORAGE_KEY)
  }

  return { capture, get, clear }
}
