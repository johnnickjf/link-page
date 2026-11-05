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
