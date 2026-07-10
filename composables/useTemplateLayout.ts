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

/** #rgb/#rrggbb -> [r,g,b] (0-255). Null se não for hex válido. */
function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    return [
      parseInt(h[0]! + h[0], 16),
      parseInt(h[1]! + h[1], 16),
      parseInt(h[2]! + h[2], 16),
    ]
  }
  if (h.length === 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ]
  }
  return null
}

/** Preto ou branco — o que for mais legível sobre a cor dada (fórmula YIQ). */
function readableOn(bg: string): string {
  const rgb = hexToRgb(bg)
  if (!rgb) return '#ffffff'
  const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
  return yiq >= 150 ? '#111827' : '#ffffff'
}

/** Converte hex em rgba() com a opacidade dada (p/ texto secundário). */
function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
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
      (b) => b.type === 'link' || b.type === 'email' || b.type === 'text' || b.type === 'image',
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

  const themeFont = computed(() => props.theme?.font ?? null)
  useHead(computed(() => ({
    link: themeFont.value
      ? [{
          rel: 'stylesheet',
          href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(themeFont.value!)}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`,
        }]
      : [],
  })))

  /** Overrides do theme (sobre os defaults do template). */
  const rootStyle = computed<Record<string, string>>(() => {
    const t = props.theme
    const style: Record<string, string> = { '--lp-accent': accent.value }
    if (!t) return style
    if (t.button_color) {
      style['--lp-link-bg'] = t.button_color
      // Sem cor de texto explícita, escolhe preto/branco legível sobre o
      // botão — evita, p.ex., o Pixel herdar o accent (= cor do botão) como
      // cor do texto e sumir com o label.
      if (!t.button_text_color) {
        style['--lp-link-fg'] = readableOn(t.button_color)
      }
      // Ícones de redes sociais acompanham a cor do botão (também são botões).
      style['--lp-social-fg'] = t.button_color
    }
    if (t.button_text_color) style['--lp-link-fg'] = t.button_text_color
    if (t.button_style && RADIUS[t.button_style]) {
      style['--lp-link-radius'] = RADIUS[t.button_style]
    }
    if (t.text_color) {
      style['--lp-text'] = t.text_color
      // A bio e textos secundários (--lp-muted) seguem a cor escolhida,
      // atenuada — antes o override só afetava título/rodapé.
      style['--lp-muted'] = withAlpha(t.text_color, 0.72)
    }
    const bg = backgroundCss(t)
    if (bg) style.background = bg
    if (t.font) style.fontFamily = `"${t.font}", ui-sans-serif, system-ui, sans-serif`
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
