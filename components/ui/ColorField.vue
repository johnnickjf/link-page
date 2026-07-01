<script setup lang="ts">
// Campo de cor: amostra (input nativo) + hex editável + botão de limpar (volta ao padrão do template).
const model = defineModel<string | undefined>({ default: undefined })
defineProps<{ label?: string }>()
const inputId = useId()

const display = computed({
  get: () => model.value ?? '#000000',
  set: (v) => { model.value = v },
})
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="inputId"
      class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>
    <div class="flex items-center gap-2">
      <input
        v-model="display"
        type="color"
        aria-label="Selecionar cor"
        class="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-transparent dark:border-gray-700"
        :class="!model ? 'opacity-40' : ''"
      />
      <UInput :id="inputId" v-model="display" placeholder="Padrão do tema" class="min-w-0 flex-1" :class="!model ? 'opacity-60' : ''" />
      <UButton
        v-if="model"
        icon="i-lucide-x"
        size="sm"
        variant="ghost"
        color="neutral"
        aria-label="Remover cor personalizada"
        @click="model = undefined"
      />
    </div>
  </div>
</template>
