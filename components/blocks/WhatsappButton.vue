<script setup lang="ts">
import type { WhatsappConfig } from '~/types/api'

// `fixed` (default) = flutua na viewport (página pública).
// `fixed=false` = absoluto, contido no container (preview do editor).
const props = withDefaults(
  defineProps<{ config: WhatsappConfig; fixed?: boolean }>(),
  { fixed: true },
)

// Botão flutuante fixo (seção 7): monta o link wa.me com mensagem opcional.
const href = computed(() => {
  const phone = props.config.phone.replace(/\D/g, '')
  const base = `https://wa.me/${phone}`
  return props.config.message
    ? `${base}?text=${encodeURIComponent(props.config.message)}`
    : base
})
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="config.label || 'WhatsApp'"
    class="bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-100"
    :class="fixed ? 'fixed' : 'absolute'"
  >
    <UIcon name="i-simple-icons-whatsapp" class="size-6 shrink-0" />
    <span v-if="config.label" class="text-sm font-semibold">{{ config.label }}</span>
  </a>
</template>
