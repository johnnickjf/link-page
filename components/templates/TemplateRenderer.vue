<script setup lang="ts">
import type { Component } from 'vue'
import type { GamerProfile, PublicBlock, Theme } from '~/types/api'
import MinimalTemplate from '~/components/templates/MinimalTemplate.vue'
import ClassicTemplate from '~/components/templates/ClassicTemplate.vue'
import DarkTemplate from '~/components/templates/DarkTemplate.vue'
import GradientTemplate from '~/components/templates/GradientTemplate.vue'
import NeonTemplate from '~/components/templates/NeonTemplate.vue'
import PixelTemplate from '~/components/templates/PixelTemplate.vue'
import ArcadeTemplate from '~/components/templates/ArcadeTemplate.vue'
import HudTemplate from '~/components/templates/HudTemplate.vue'
import EsportsTemplate from '~/components/templates/EsportsTemplate.vue'
import CozyTemplate from '~/components/templates/CozyTemplate.vue'

// Despacha o template pelo id (page.template). Reusado no preview do editor e
// na página pública. Id desconhecido cai no 'minimal'. Template novo entra neste
// mapa e no catálogo do backend (template_service.py).
const props = defineProps<{
  template: string
  title: string
  bio?: string | null
  avatarUrl?: string | null
  theme?: Theme | null
  blocks: PublicBlock[]
  preview?: boolean
  profileMeta?: GamerProfile | null
}>()

const TEMPLATES: Record<string, Component> = {
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
  dark: DarkTemplate,
  gradient: GradientTemplate,
  neon: NeonTemplate,
  pixel: PixelTemplate,
  arcade: ArcadeTemplate,
  hud: HudTemplate,
  esports: EsportsTemplate,
  cozy: CozyTemplate,
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
    :profile-meta="profileMeta"
  >
    <!-- Toggle de seções (opcional): repassado ao template, que o coloca
         logo após o cabeçalho. Sem seções, nada é passado = zero mudança. -->
    <template #tabs><slot name="tabs" /></template>
  </component>
</template>
