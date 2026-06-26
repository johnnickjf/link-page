<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({
  title: () =>
    `${is404.value ? 'Página não encontrada' : 'Erro'} · LinkLand`,
})

function goHome(): void {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center text-gray-900 dark:bg-gray-950 dark:text-gray-100"
  >
    <div class="max-w-md">
      <p class="font-display text-7xl font-bold text-primary-500">
        {{ error?.statusCode || 500 }}
      </p>
      <h1 class="mt-4 text-2xl font-bold tracking-tight">
        {{ is404 ? 'Página não encontrada' : 'Algo deu errado' }}
      </h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{
          is404
            ? 'Esse endereço não existe ou ainda não foi publicado.'
            : 'Tente novamente em instantes.'
        }}
      </p>
      <UButton class="mt-6" size="lg" @click="goHome">Voltar ao início</UButton>
    </div>
  </div>
</template>
