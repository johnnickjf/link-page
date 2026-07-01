<script setup lang="ts">
const props = defineProps<{ password: string }>()

interface Criterion {
  label: string
  test: (p: string) => boolean
}

const criteria: Criterion[] = [
  { label: '8 ou mais caracteres', test: (p) => p.length >= 8 },
  { label: 'Letra maiúscula', test: (p) => /[A-Z]/.test(p) },
  { label: 'Letra minúscula', test: (p) => /[a-z]/.test(p) },
  { label: 'Número', test: (p) => /\d/.test(p) },
  { label: 'Caractere especial', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

const score = computed(() => criteria.filter((c) => c.test(props.password)).length)

const label = computed(() => {
  if (!props.password) return ''
  if (score.value <= 2) return 'Fraca'
  if (score.value <= 3) return 'Média'
  return 'Forte'
})

const color = computed(() => {
  if (!props.password) return 'bg-gray-200 dark:bg-gray-700'
  if (score.value <= 2) return 'bg-red-500'
  if (score.value <= 3) return 'bg-amber-400'
  return 'bg-green-500'
})

const textColor = computed(() => {
  if (!props.password) return 'text-gray-400'
  if (score.value <= 2) return 'text-red-500'
  if (score.value <= 3) return 'text-amber-500'
  return 'text-green-600 dark:text-green-400'
})
</script>

<template>
  <div v-if="password" class="space-y-1.5">
    <div class="flex gap-1">
      <div
        v-for="i in 5"
        :key="i"
        class="h-1 flex-1 rounded-full transition-colors duration-300"
        :class="i <= score ? color : 'bg-gray-200 dark:bg-gray-700'"
      />
    </div>
    <p class="text-xs font-medium transition-colors" :class="textColor">{{ label }}</p>
  </div>
</template>
