<script setup lang="ts">
import type { SocialConfig } from '~/types/api'

const props = defineProps<{ config: SocialConfig }>()

// network (seção 4) -> ícone de marca (simple-icons). Fallback genérico.
const ICONS: Record<string, string> = {
  instagram: 'i-simple-icons-instagram',
  tiktok: 'i-simple-icons-tiktok',
  youtube: 'i-simple-icons-youtube',
  x: 'i-simple-icons-x',
  twitter: 'i-simple-icons-x',
  facebook: 'i-simple-icons-facebook',
  linkedin: 'i-simple-icons-linkedin',
  github: 'i-simple-icons-github',
  twitch: 'i-simple-icons-twitch',
  telegram: 'i-simple-icons-telegram',
  whatsapp: 'i-simple-icons-whatsapp',
  spotify: 'i-simple-icons-spotify',
  threads: 'i-simple-icons-threads',
  pinterest: 'i-simple-icons-pinterest',
}

const iconName = computed(
  () => ICONS[props.config.network?.toLowerCase()] ?? 'i-lucide-link',
)
</script>

<template>
  <a
    :href="safeUrl(config.url)"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="config.network"
    class="lp-social"
  >
    <UIcon :name="iconName" class="size-6" />
  </a>
</template>
