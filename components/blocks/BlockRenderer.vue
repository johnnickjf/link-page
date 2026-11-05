<script setup lang="ts">
import type { PublicBlock } from '~/types/api'

// Despacha blocos "em linha" (link / texto / imagem / mapa). Social e
// WhatsApp são tratados separadamente pelo template (linha de ícones / botão
// flutuante).
defineProps<{ block: PublicBlock }>()
</script>

<template>
  <LinkBlock v-if="block.type === 'link'" :config="block.config" :data-block-id="block.id" />
  <EmailBlock v-else-if="block.type === 'email'" :config="block.config" :data-block-id="block.id" />
  <TextBlock v-else-if="block.type === 'text'" :config="block.config" />
  <ImageBlock v-else-if="block.type === 'image'" :config="block.config" :data-block-id="block.id" />
  <MapBlock v-else-if="block.type === 'map'" :config="block.config" :data-block-id="block.id" />
</template>
