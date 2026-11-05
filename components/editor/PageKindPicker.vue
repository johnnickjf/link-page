<script setup lang="ts">
import type { PageKind } from '~/types/api'

const model = defineModel<PageKind>({ required: true })

const OPTIONS: { value: PageKind, label: string, text: string, icon: string }[] = [
  { value: 'standard', label: 'Página de links', text: 'Para qualquer pessoa ou negócio', icon: 'i-lucide-link' },
  { value: 'gamer', label: 'Perfil gamer', text: 'IDs, jogos e canais de stream', icon: 'i-lucide-gamepad-2' },
]
</script>

<template>
  <div role="radiogroup" aria-label="Tipo de página" class="grid grid-cols-2 gap-2">
    <button
      v-for="o in OPTIONS"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="model === o.value"
      class="rounded-lg border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      :class="model === o.value
        ? 'border-primary-500 ring-2 ring-primary-500/30'
        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
      @click="model = o.value"
    >
      <UIcon :name="o.icon" class="size-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
      <span class="mt-1.5 block text-sm font-medium">{{ o.label }}</span>
      <span class="block text-xs text-gray-600 dark:text-gray-400">{{ o.text }}</span>
    </button>
  </div>
</template>
