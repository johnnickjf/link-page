import type { PublicBlock, PublicPage } from '~/types/api'

/** Tamanho que o Google costuma mostrar na descrição do resultado. */
const DESCRIPTION_MAX = 160

type SocialBlock = Extract<PublicBlock, { type: 'social' }>

/** Blocos de redes sociais de todas as seções (ou da página sem seções). */
function socialBlocks(page: PublicPage): SocialBlock[] {
  const fromTabs = (page.tabs ?? []).flatMap((t) => t.blocks)
  return (fromTabs.length ? fromTabs : page.blocks).filter((b): b is SocialBlock => b.type === 'social')
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

/** Redes da página, na ordem em que aparecem (ex.: ['Instagram', 'TikTok']). */
function networks(page: PublicPage): string[] {
  const labels = socialBlocks(page)
    .map((b) => networkLabel(b.config?.network))
    .filter(Boolean)
  return [...new Set(labels)]
}

/**
 * Descrição para busca e compartilhamento. Sem bio, monta uma frase com o nome e
 * as redes, em vez de deixar o Google escolher um trecho qualquer da página.
 */
export function publicDescription(page: PublicPage): string {
  if (page.bio?.trim()) return clip(page.bio, DESCRIPTION_MAX)
  const nets = networks(page)
  const base = nets.length
    ? `Links de ${page.title}: ${nets.slice(0, 4).join(', ')} e mais, em um só lugar.`
    : `Todos os links de ${page.title} em um só lugar.`
  return clip(base, DESCRIPTION_MAX)
}

/** Endereço canônico: sem parâmetros de campanha (?utm=...) e com o slug em minúsculas. */
export function publicCanonical(origin: string, page: PublicPage): string {
  return `${origin.replace(/\/+$/, '')}/${encodeURIComponent(page.slug.toLowerCase())}`
}

/**
 * Dados estruturados de perfil (schema.org ProfilePage). `sameAs` liga a página às
 * redes da pessoa, o que ajuda o Google a entender que são o mesmo perfil.
 */
export function profileJsonLd(page: PublicPage, canonical: string): string {
  const sameAs = socialBlocks(page)
    .map((b) => safeUrl(b.config?.url))
    .filter((u): u is string => Boolean(u))
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: canonical,
    name: page.title,
    mainEntity: {
      '@type': 'Person',
      name: page.title,
      description: publicDescription(page),
      ...(page.avatar_url ? { image: page.avatar_url } : {}),
      ...(sameAs.length ? { sameAs: [...new Set(sameAs)] } : {}),
    },
  }
  // `<` escapado: o texto vem do usuário e não pode fechar a tag <script>.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
