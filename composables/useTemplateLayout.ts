import type { PublicBlock, Theme } from '~/types/api'

interface TemplateInput {
  blocks: PublicBlock[]
  theme?: Theme | null
  title: string
}

const RADIUS: Record<string, string> = {
  rounded: '0.9rem',
  square: '0.375rem',
  pill: '9999px',
}

/** Monta o `background` CSS a partir do theme (cor / gradiente / imagem). */
function backgroundCss(t: Theme): string | undefined {
  if (t.background_type === 'color' && t.background_value) {
    return t.background_value
  }
  if (t.background_type === 'gradient' && t.background_from && t.background_to) {
    return `linear-gradient(${t.background_direction || '135deg'}, ${t.background_from}, ${t.background_to})`
  }
  if (t.background_type === 'image' && t.background_value) {
    return `url("${t.background_value}") center / cover no-repeat`
  }
  return undefined
}

/**
 * Lógica compartilhada por todos os templates: ordena blocos, agrupa redes,
 * isola o WhatsApp, e converte o `theme` em variáveis CSS (`--lp-*`) aplicadas
 * POR CIMA dos defaults do template. Cada template cuida só da identidade visual.
 */
export function useTemplateLayout(props: TemplateInput, defaultAccent = '#4f46e5') {
  const sorted = computed(() =>
    [...props.blocks].sort((a, b) => a.position - b.position),
  )

  const inlineBlocks = computed(() =>
    sorted.value.filter(
      (b) => b.type === 'link' || b.type === 'text' || b.type === 'image',
    ),
  )

  const socialBlocks = computed(() =>
    sorted.value.filter(
      (b): b is Extract<PublicBlock, { type: 'social' }> => b.type === 'social',
    ),
  )

  const whatsapp = computed(() =>
    sorted.value.find(
      (b): b is Extract<PublicBlock, { type: 'whatsapp' }> =>
        b.type === 'whatsapp',
    ),
  )

  const accent = computed(() => props.theme?.button_color || defaultAccent)
  const initials = computed(
    () => props.title?.trim().charAt(0).toUpperCase() || '?',
  )
  const showBranding = computed(() => !props.theme?.hide_branding)

  /** Overrides do theme (sobre os defaults do template). */
  const rootStyle = computed<Record<string, string>>(() => {
    const t = props.theme
    const style: Record<string, string> = { '--lp-accent': accent.value }
    if (!t) return style
    if (t.button_color) style['--lp-link-bg'] = t.button_color
    if (t.button_text_color) style['--lp-link-fg'] = t.button_text_color
    if (t.button_style && RADIUS[t.button_style]) {
      style['--lp-link-radius'] = RADIUS[t.button_style]
    }
    if (t.text_color) style['--lp-text'] = t.text_color
    const bg = backgroundCss(t)
    if (bg) style.background = bg
    return style
  })

  return {
    sorted,
    inlineBlocks,
    socialBlocks,
    whatsapp,
    accent,
    initials,
    showBranding,
    rootStyle,
  }
}
