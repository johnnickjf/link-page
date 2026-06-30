// Validações client-side básicas, espelhando as regras do backend.
// A validação final é sempre do back; aqui é só UX.

export function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

/** Slug do back: minúsculo, [a-z0-9-], 3–40 chars. Validação só de formato. */
export function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9-]{3,40}$/.test(slug)
}

/**
 * Sanitiza URL de conteúdo do usuário antes de virar `href` (a página pública
 * renderiza dados de terceiros). Permite http(s)/mailto/tel e caminhos relativos;
 * sem esquema, assume https; bloqueia `javascript:`, `data:`, etc. (→ undefined).
 */
export function safeUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  const u = url.trim()
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u
  if (/^[/#]/.test(u)) return u
  // Sem esquema → trata como https; com esquema não permitido → bloqueia.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) return `https://${u}`
  return undefined
}

/** Gera um slug sugerido a partir de um texto (acentos -> ascii, espaços -> -). */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

/**
 * Regras de senha do backend (seção 6): mín. 8 caracteres, 1 maiúscula,
 * 1 minúscula e 1 número. Retorna a primeira mensagem de erro, ou null.
 */
export function passwordError(password: string): string | null {
  if (password.length < 8) return 'Mínimo de 8 caracteres'
  if (!/[A-Z]/.test(password)) return 'Inclua ao menos 1 letra maiúscula'
  if (!/[a-z]/.test(password)) return 'Inclua ao menos 1 letra minúscula'
  if (!/[0-9]/.test(password)) return 'Inclua ao menos 1 número'
  return null
}
