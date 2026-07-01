<script setup lang="ts">
import type { Component } from 'vue'
import type { PublicBlock, Theme } from '~/types/api'
import MinimalTemplate from '~/components/templates/MinimalTemplate.vue'
import ClassicTemplate from '~/components/templates/ClassicTemplate.vue'
import DarkTemplate from '~/components/templates/DarkTemplate.vue'
import GradientTemplate from '~/components/templates/GradientTemplate.vue'
import NeonTemplate from '~/components/templates/NeonTemplate.vue'
import PixelTemplate from '~/components/templates/PixelTemplate.vue'

// Despacha o template pelo id (page.template). Reusado no preview do editor e
// na página pública (Fase 6). Fallback para 'minimal'. Novos templates da
// Fase 7 entram neste mapa.
const props = defineProps<{
  template: string
  title: string
  bio?: string | null
  avatarUrl?: string | null
  theme?: Theme | null
  blocks: PublicBlock[]
  preview?: boolean
}>()

// Selecionáveis hoje (GET /template no back): minimal, classic, dark.
// gradient e neon já existem no front e ficam selecionáveis quando o back
// adicioná-los. Fallback: minimal.
const TEMPLATES: Record<string, Component> = {
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
  dark: DarkTemplate,
  gradient: GradientTemplate,
  neon: NeonTemplate,
  pixel: PixelTemplate,
}

const component = computed<Component>(
  () => TEMPLATES[props.template] ?? MinimalTemplate,
)
</script>

<template>
  <component
    :is="component"
    :title="title"
    :bio="bio"
    :avatar-url="avatarUrl"
    :theme="theme"
    :blocks="blocks"
    :preview="preview"
  />
</template>
