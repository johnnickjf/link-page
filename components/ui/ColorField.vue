<script setup lang="ts">
// Campo de cor: amostra (input nativo) + hex editável. v-model = string hex.
const model = defineModel<string>({ default: '#000000' })
defineProps<{ label?: string }>()
const inputId = useId()
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
        v-model="model"
        type="color"
        aria-label="Selecionar cor"
        class="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-transparent dark:border-gray-700"
      />
      <UInput :id="inputId" v-model="model" placeholder="#000000" class="w-full" />
    </div>
  </div>
</template>
