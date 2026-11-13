import { defineAsyncComponent, type Component } from 'vue'

/** Miniatura de cada template: dá para reconhecer pelo olho, sem ler o nome. */
export const TEMPLATE_SWATCHES: Record<string, { bg: string, bar: string, ring?: string }> = {
  minimal: { bg: '#ffffff', bar: '#e2e8f0', ring: '#e2e8f0' },
  classic: { bg: '#f8f5ee', bar: '#d6d3d1', ring: '#e7e5e4' },
  dark: { bg: '#18181b', bar: '#3f3f46' },
  gradient: { bg: 'linear-gradient(160deg, #4338ca, #7e22ce 48%, #be185d)', bar: 'rgb(255 255 255 / 0.3)' },
  neon: { bg: '#050507', bar: '#22d3ee' },
  pixel: { bg: '#0a0a16', bar: '#22c55e' },
  arcade: { bg: 'linear-gradient(180deg, #12052e, #2a0a4a)', bar: '#ff4fd8' },
  hud: { bg: '#0b0e0a', bar: '#facc15' },
  esports: { bg: 'linear-gradient(115deg, #0a0a0c 60%, #ef4444 60%)', bar: '#3f3f46' },
  cozy: { bg: '#f7f0e1', bar: '#cfe3c8', ring: '#e3d9bf' },
  aurora: { bg: 'radial-gradient(80% 90% at 0% 0%, #e9d5ff, transparent 70%), radial-gradient(80% 90% at 100% 100%, #fed7aa, transparent 70%), #fbf8ff', bar: 'rgb(255 255 255 / 0.9)', ring: '#ede9fe' },
  noir: { bg: '#0d0c0b', bar: '#d4af37' },
  terminal: { bg: '#050806', bar: '#39ff88' },
  quest: { bg: 'radial-gradient(70% 60% at 50% 0%, #4c2a7a, #14101d 75%)', bar: '#c084fc' },
}
const FALLBACK_SWATCH = { bg: '#f1f5f9', bar: '#cbd5e1' }

export function templateSwatch(id: string): { bg: string, bar: string, ring?: string } {
  return TEMPLATE_SWATCHES[id] ?? FALLBACK_SWATCH
}

/** Nome de exibição do template (o mesmo do catálogo do backend). */
export function templateName(id: string): string {
  if (id === 'hud') return 'HUD'
  return id ? id.charAt(0).toUpperCase() + id.slice(1) : ''
}

/**
 * Componente de cada template, carregado sob demanda: a página pública baixa só
 * o código e o CSS do template que usa, em vez dos 14. Template novo entra aqui,
 * em TEMPLATE_SWATCHES e no catálogo do backend (template_service.py).
 */
export const TEMPLATE_LOADERS = {
  minimal: () => import('~/components/templates/MinimalTemplate.vue'),
  classic: () => import('~/components/templates/ClassicTemplate.vue'),
  dark: () => import('~/components/templates/DarkTemplate.vue'),
  gradient: () => import('~/components/templates/GradientTemplate.vue'),
  neon: () => import('~/components/templates/NeonTemplate.vue'),
  pixel: () => import('~/components/templates/PixelTemplate.vue'),
  arcade: () => import('~/components/templates/ArcadeTemplate.vue'),
  hud: () => import('~/components/templates/HudTemplate.vue'),
  esports: () => import('~/components/templates/EsportsTemplate.vue'),
  cozy: () => import('~/components/templates/CozyTemplate.vue'),
  aurora: () => import('~/components/templates/AuroraTemplate.vue'),
  noir: () => import('~/components/templates/NoirTemplate.vue'),
  terminal: () => import('~/components/templates/TerminalTemplate.vue'),
  quest: () => import('~/components/templates/QuestTemplate.vue'),
} as const

/** Um componente assíncrono por template, criado uma vez só. */
export const TEMPLATE_COMPONENTS: Record<string, Component> = Object.fromEntries(
  Object.entries(TEMPLATE_LOADERS).map(([id, load]) => [id, defineAsyncComponent(load)]),
)

/** Baixa todos os templates em segundo plano (editor: trocar de tema sem espera). */
export function preloadTemplates(): void {
  for (const load of Object.values(TEMPLATE_LOADERS)) load().catch(() => {})
}
