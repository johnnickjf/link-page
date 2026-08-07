<script setup lang="ts">
import type { MapConfig } from '~/types/api'

const props = defineProps<{ config: MapConfig }>()

// `config.address` já vem normalizado pelo backend: endereço/CEP em texto
// livre ou "lat,lng" (extraído de um link do Google Maps). Os dois formatos
// funcionam do mesmo jeito nos endpoints do Google, então não precisa
// distinguir aqui — só codifica como query.
const embedUrl = computed(
  () => `https://www.google.com/maps?q=${encodeURIComponent(props.config.address)}&output=embed`,
)
const openUrl = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.config.address)}`,
)
</script>

<template>
  <div>
    <div
      class="relative h-40 w-full overflow-hidden"
      :style="{ borderRadius: 'var(--lp-link-radius, 0.9rem)', border: '1px solid var(--lp-link-border, #e5e7eb)' }"
    >
      <iframe
        :src="embedUrl"
        class="h-full w-full border-0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        tabindex="-1"
        aria-hidden="true"
      />
      <!-- Overlay transparente: o iframe do Maps é interativo (arrasta/dá
           zoom), o que impediria um clique simples de navegar. Isso captura
           o clique em qualquer ponto do mapinha e leva pro Maps de verdade. -->
      <a
        :href="openUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute inset-0"
        :aria-label="config.label || 'Abrir no Google Maps'"
      />
    </div>
    <p
      v-if="config.label"
      class="mt-2 text-center text-sm"
      :style="{ color: 'var(--lp-muted)' }"
    >
      {{ config.label }}
    </p>
  </div>
</template>
