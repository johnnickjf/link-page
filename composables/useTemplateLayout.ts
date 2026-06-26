import type { PublicBlock, Theme } from '~/types/api'

interface TemplateInput {
  blocks: PublicBlock[]
  theme?: Theme | null
  title: string
}

/**
 * Lógica compartilhada por todos os templates: ordena blocos por posição,
 * agrupa redes sociais, isola o WhatsApp e resolve cor de destaque/iniciais.
 * Cada template cuida só da identidade visual.
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

  const accent = computed(() => props.theme?.primary || defaultAccent)
  const initials = computed(
    () => props.title?.trim().charAt(0).toUpperCase() || '?',
  )

  return { sorted, inlineBlocks, socialBlocks, whatsapp, accent, initials }
}
