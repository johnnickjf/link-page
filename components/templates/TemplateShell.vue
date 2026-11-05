<script setup lang="ts">
import type { GamerProfile, PublicBlock, Theme } from '~/types/api'

// Estrutura comum a todos os templates: redes, blocos, assinatura e WhatsApp,
// nessa ordem. Cada template entra só com a identidade dele: as classes, o
// cabeçalho e o CSS com as variáveis --lp-* (contrato em ./README.md).
//
// As classes em `rootClass` chegam ao elemento raiz daqui, que herda o escopo
// CSS do template. Elementos internos do shell não herdam: um template que
// estilize `contentClass` precisa usar :deep().
const props = withDefaults(
  defineProps<{
    title: string
    bio?: string | null
    avatarUrl?: string | null
    theme?: Theme | null
    blocks: PublicBlock[]
    preview?: boolean
    // Chega por herança de atributos: os templates não precisam conhecer.
    profileMeta?: GamerProfile | null
    rootClass: string
    contentClass: string
    blocksClass?: string
    defaultAccent?: string
  }>(),
  { blocksClass: 'mt-8 space-y-3', defaultAccent: '#4f46e5' },
)

const { inlineBlocks, socialBlocks, whatsapp, accent, iconMode, initials, showBranding, rootStyle } =
  useTemplateLayout(props, props.defaultAccent)
</script>

<template>
  <div
:class="['lp-root', rootClass, preview ? 'relative min-h-full' : 'min-h-screen', whatsapp && !preview ? 'pb-28' : '']"
    :style="rootStyle"
    :data-icon-mode="iconMode"
  >
    <div class="lp-animate" :class="contentClass">
      <slot name="header" :accent="accent" :initials="initials" />

      <GamerHeaderInfo v-if="profileMeta" :meta="profileMeta" />

      <slot name="tabs" />

      <div
        v-if="socialBlocks.length"
        class="mt-6 flex flex-wrap justify-center gap-5"
      >
        <SocialBlock
          v-for="(b, i) in socialBlocks"
          :key="`s-${i}`"
          :config="b.config"
          :data-block-id="b.id"
        />
      </div>

      <div :class="blocksClass">
        <BlockRenderer v-for="(b, i) in inlineBlocks" :key="`b-${i}`" :block="b" />
      </div>

      <BrandingBadge v-if="showBranding" />
    </div>

    <WhatsappButton v-if="whatsapp" :config="whatsapp.config" :fixed="!preview" :data-block-id="whatsapp.id" />
  </div>
</template>
