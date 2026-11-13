<script setup lang="ts">
import type { Component } from 'vue'
import type { GamerProfile, PageProgress, PublicBlock, Theme } from '~/types/api'

// Despacha o template pelo id (page.template). Reusado no preview do editor e
// na página pública. Id desconhecido cai no 'minimal'. Cada template é carregado
// sob demanda (ver TEMPLATE_LOADERS): no SSR o HTML sai completo e o CSS do
// template usado vem junto; o navegador não baixa os outros.
const props = defineProps<{
  template: string
  title: string
  bio?: string | null
  avatarUrl?: string | null
  theme?: Theme | null
  blocks: PublicBlock[]
  preview?: boolean
  profileMeta?: GamerProfile | null
  progress?: PageProgress | null
}>()

const component = computed<Component>(
  () => TEMPLATE_COMPONENTS[props.template] ?? TEMPLATE_COMPONENTS.minimal!,
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
    :progress="progress"
  >
    <!-- Toggle de seções (opcional): repassado ao template, que o coloca
         logo após o cabeçalho. Sem seções, nada é passado = zero mudança. -->
    <template #tabs><slot name="tabs" /></template>
  </component>
</template>
