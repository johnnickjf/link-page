/** Redes aceitas no bloco social, com o nome como as pessoas conhecem. */
export const NETWORK_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X (Twitter)',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  twitch: 'Twitch',
  telegram: 'Telegram',
  spotify: 'Spotify',
  threads: 'Threads',
  pinterest: 'Pinterest',
  discord: 'Discord',
  kick: 'Kick',
  steam: 'Steam',
  playstation: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
  riot: 'Riot Games',
  epic: 'Epic Games',
  battlenet: 'Battle.net',
  roblox: 'Roblox',
}

export function networkLabel(network?: string | null): string {
  const key = (network ?? '').toLowerCase()
  return NETWORK_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

// Domínio -> rede. Só redes que o bloco social aceita (chaves de NETWORK_LABELS).
const NETWORK_HOSTS: [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)(x\.com|twitter\.com)$/, 'x'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'facebook'],
  [/(^|\.)linkedin\.com$/, 'linkedin'],
  [/(^|\.)github\.com$/, 'github'],
  [/(^|\.)twitch\.tv$/, 'twitch'],
  [/(^|\.)(t\.me|telegram\.me)$/, 'telegram'],
  [/(^|\.)spotify\.com$/, 'spotify'],
  [/(^|\.)threads\.(net|com)$/, 'threads'],
  [/(^|\.)(pinterest\.[a-z.]+|pin\.it)$/, 'pinterest'],
  [/(^|\.)(discord\.gg|discord\.com)$/, 'discord'],
  [/(^|\.)kick\.com$/, 'kick'],
  [/(^|\.)steamcommunity\.com$/, 'steam'],
  [/(^|\.)roblox\.com$/, 'roblox'],
]

function parseUrl(raw?: string | null): URL | null {
  const text = (raw ?? '').trim()
  if (!text || /\s/.test(text)) return null
  try {
    return new URL(/^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`)
  } catch {
    return null
  }
}

/** Rede social de um endereço (ex.: 'instagram.com/loja' -> 'instagram'), ou null. */
export function detectNetwork(raw?: string | null): string | null {
  const url = parseUrl(raw)
  if (!url || !/^https?:$/.test(url.protocol)) return null
  const host = url.hostname.toLowerCase()
  return NETWORK_HOSTS.find(([re]) => re.test(host))?.[1] ?? null
}

/**
 * Número de um link de WhatsApp (wa.me/55..., api.whatsapp.com/send?phone=55...),
 * só com dígitos, ou null quando o link não traz um número.
 */
export function whatsappPhoneFromUrl(raw?: string | null): string | null {
  const url = parseUrl(raw)
  if (!url) return null
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  let phone = ''
  if (host === 'wa.me') phone = url.pathname.slice(1)
  else if (/(^|\.)whatsapp\.com$/.test(host)) phone = url.searchParams.get('phone') ?? ''
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15 ? digits : null
}
