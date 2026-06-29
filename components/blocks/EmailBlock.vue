<script setup lang="ts">
import type { EmailConfig } from '~/types/api'

const props = defineProps<{ config: EmailConfig }>()

const href = computed(() => {
  const params = new URLSearchParams()
  if (props.config.subject) params.set('subject', props.config.subject)
  const qs = params.toString()
  return `mailto:${props.config.email}${qs ? `?${qs}` : ''}`
})
</script>

<template>
  <a :href="href" class="lp-link">
    <UIcon name="i-lucide-mail" class="size-5 shrink-0" />
    <span>{{ config.label || 'Enviar e-mail' }}</span>
  </a>
</template>
