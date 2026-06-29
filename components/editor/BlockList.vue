<script setup lang="ts">
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import type { Block } from '~/types/api'

// v-model = blocos na ordem atual. Drag vertical reordena o array e emite
// `reorder` (o editor persiste via PATCH /block/reorder).
const blocks = defineModel<Block[]>({ required: true })
const emit = defineEmits<{
  reorder: []
  edit: [block: Block]
  remove: [block: Block]
  toggle: [block: Block]
}>()

const listEl = ref<HTMLElement | null>(null)
useSortable(listEl, blocks, {
  handle: '.drag-handle',
  animation: 150,
  onUpdate: async (e: { oldIndex?: number; newIndex?: number }) => {
    if (e.oldIndex == null || e.newIndex == null) return
    moveArrayElement(blocks, e.oldIndex, e.newIndex)
    await nextTick()
    emit('reorder')
  },
})

const ICONS: Record<Block['type'], string> = {
  link: 'i-lucide-link',
  social: 'i-lucide-at-sign',
  whatsapp: 'i-simple-icons-whatsapp',
  text: 'i-lucide-type',
  image: 'i-lucide-image',
}

function title(b: Block): string {
  switch (b.type) {
    case 'link':
      return b.config.label || 'Link'
    case 'social':
      return b.config.network || 'Rede social'
    case 'whatsapp':
      return b.config.label || 'WhatsApp'
    case 'text':
      return b.config.content || 'Texto'
    case 'image':
      return b.config.alt || 'Imagem'
  }
}

function subtitle(b: Block): string {
  switch (b.type) {
    case 'link':
      return b.config.url
    case 'social':
      return b.config.url
    case 'whatsapp':
      return b.config.phone
    case 'text':
      return 'Texto'
    case 'image':
      return b.config.url
  }
}
</script>

<template>
  <div>
    <div
      v-if="blocks.length === 0"
      class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700"
    >
      Nenhum bloco ainda. Adicione o primeiro abaixo.
    </div>

    <div ref="listEl" class="space-y-2 overflow-hidden">
      <div
        v-for="block in blocks"
        :key="block.id"
        class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
        :class="{ 'opacity-50': !block.is_active }"
      >
        <button
          type="button"
          class="drag-handle cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          aria-label="Arrastar para reordenar"
        >
          <UIcon name="i-lucide-grip-vertical" class="size-5" />
        </button>

        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <UIcon :name="ICONS[block.type]" class="size-5" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">{{ title(block) }}</p>
          <p class="truncate text-xs text-gray-500 dark:text-gray-400">
            {{ subtitle(block) }}
          </p>
        </div>

        <USwitch
          :model-value="block.is_active"
          aria-label="Ativo"
          @update:model-value="emit('toggle', block)"
        />
        <UButton
          icon="i-lucide-pencil"
          size="sm"
          variant="ghost"
          color="neutral"
          aria-label="Editar bloco"
          @click="emit('edit', block)"
        />
        <UButton
          icon="i-lucide-trash-2"
          size="sm"
          variant="ghost"
          color="error"
          aria-label="Excluir bloco"
          @click="emit('remove', block)"
        />
      </div>
    </div>
  </div>
</template>
