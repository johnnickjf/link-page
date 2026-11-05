import type { GamePlatform } from '~/types/api'

export interface PlatformInfo {
  label: string
  icon: string
  /** Texto de ajuda no editor: como a pessoa acha o próprio ID. */
  placeholder: string
  /** A plataforma tem página pública de perfil? Se não, o visitante copia o ID. */
  hasProfileUrl: boolean
}

export const PLATFORMS: Record<GamePlatform, PlatformInfo> = {
  steam: { label: 'Steam', icon: 'i-simple-icons-steam', placeholder: 'SeuNome', hasProfileUrl: true },
  xbox: { label: 'Xbox', icon: 'i-simple-icons-xbox', placeholder: 'SuaGamertag', hasProfileUrl: true },
  psn: { label: 'PlayStation', icon: 'i-simple-icons-playstation', placeholder: 'seu_id_psn', hasProfileUrl: false },
  nintendo: { label: 'Nintendo', icon: 'i-simple-icons-nintendo', placeholder: 'SW-1234-5678-9012', hasProfileUrl: false },
  riot: { label: 'Riot ID', icon: 'i-simple-icons-riotgames', placeholder: 'Nome#BR1', hasProfileUrl: false },
  epic: { label: 'Epic Games', icon: 'i-simple-icons-epicgames', placeholder: 'SeuNome', hasProfileUrl: false },
  battlenet: { label: 'Battle.net', icon: 'i-simple-icons-battledotnet', placeholder: 'Nome#1234', hasProfileUrl: false },
  discord: { label: 'Discord', icon: 'i-simple-icons-discord', placeholder: 'seu_usuario', hasProfileUrl: false },
  ea: { label: 'EA', icon: 'i-simple-icons-ea', placeholder: 'SeuNome', hasProfileUrl: false },
  ubisoft: { label: 'Ubisoft', icon: 'i-simple-icons-ubisoft', placeholder: 'SeuNome', hasProfileUrl: false },
  roblox: { label: 'Roblox', icon: 'i-simple-icons-roblox', placeholder: 'SeuNome', hasProfileUrl: true },
  other: { label: 'Outro', icon: 'i-lucide-gamepad-2', placeholder: 'Seu ID', hasProfileUrl: true },
}

export const PLATFORM_OPTIONS = (Object.keys(PLATFORMS) as GamePlatform[]).map((value) => ({
  value,
  label: PLATFORMS[value].label,
}))

export const BADGE_ICONS: Record<string, string> = {
  trophy: 'i-lucide-trophy',
  medal: 'i-lucide-medal',
  crown: 'i-lucide-crown',
  flame: 'i-lucide-flame',
  swords: 'i-lucide-swords',
  target: 'i-lucide-target',
  star: 'i-lucide-star',
  zap: 'i-lucide-zap',
  shield: 'i-lucide-shield',
  gem: 'i-lucide-gem',
  rocket: 'i-lucide-rocket',
  gamepad: 'i-lucide-gamepad-2',
}

export const EMBED_PROVIDERS = {
  twitch: { label: 'Twitch', icon: 'i-simple-icons-twitch', cta: 'Assistir na Twitch', hint: 'Nome do canal ou link', placeholder: 'https://twitch.tv/seu_canal' },
  youtube: { label: 'YouTube', icon: 'i-simple-icons-youtube', cta: 'Assistir no YouTube', hint: 'Link do vídeo', placeholder: 'https://youtu.be/…' },
  discord: { label: 'Discord', icon: 'i-simple-icons-discord', cta: 'Ver servidor no Discord', hint: 'ID do servidor (Configurações do servidor › Widget)', placeholder: '81384788765712384' },
} as const

export type EmbedProvider = keyof typeof EMBED_PROVIDERS

/**
 * Endereço do player. Só hosts fixos: `value` já foi reduzido a um identificador
 * pelo backend, e ainda assim é codificado aqui.
 */
export function embedSrc(provider: EmbedProvider, value: string, parent: string): string {
  const id = encodeURIComponent(value)
  switch (provider) {
    case 'twitch':
      return `https://player.twitch.tv/?channel=${id}&parent=${encodeURIComponent(parent)}&autoplay=true`
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    case 'discord':
      return `https://discord.com/widget?id=${id}&theme=dark`
  }
}
