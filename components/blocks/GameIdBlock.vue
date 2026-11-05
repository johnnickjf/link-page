<script setup lang="ts">
import type { GameIdConfig } from '~/types/api'

const props = defineProps<{ config: GameIdConfig }>()

const info = computed(() => PLATFORMS[props.config.platform] ?? PLATFORMS.other)
const href = computed(() => safeUrl(props.config.url))
const label = computed(() => props.config.label || info.value.label)
const copied = ref(false)

// Sem página pública de perfil (PSN, Riot...), o gesto útil é copiar o ID.
async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.config.handle)
  } catch {
    const area = document.createElement('textarea')
    area.value = props.config.handle
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.append(area)
    area.select()
    document.execCommand('copy')
    area.remove()
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="lp-link lp-gameid"
  >
    <UIcon :name="info.icon" class="size-5 shrink-0" />
    <span class="lp-gameid__text">
      <span class="lp-gameid__label">{{ label }}</span>
      <span class="lp-gameid__handle">{{ config.handle }}</span>
    </span>
    <UIcon name="i-lucide-arrow-up-right" class="lp-gameid__action size-4 shrink-0" />
  </a>
  <button
    v-else
    type="button"
    class="lp-link lp-gameid"
    :aria-label="`Copiar ${label}: ${config.handle}`"
    @click="copy"
  >
    <UIcon :name="info.icon" class="size-5 shrink-0" />
    <span class="lp-gameid__text">
      <span class="lp-gameid__label">{{ copied ? 'Copiado!' : label }}</span>
      <span class="lp-gameid__handle">{{ config.handle }}</span>
    </span>
    <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="lp-gameid__action size-4 shrink-0" />
    <span class="sr-only" role="status">{{ copied ? 'ID copiado' : '' }}</span>
  </button>
</template>
