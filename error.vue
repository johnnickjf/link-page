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
    class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center text-gray-900 dark:bg-gray-950 dark:text-gray-100"
  >
    <div class="mb-10">
      <Logo />
    </div>

    <div class="max-w-sm">
      <p class="font-display text-8xl font-bold text-primary-500 select-none">
        {{ error?.statusCode || 500 }}
      </p>

      <h1 class="mt-4 text-2xl font-bold tracking-tight">
        {{ is404 ? 'Essa página não existe' : 'Algo deu errado' }}
      </h1>

      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{
          is404
            ? 'Esse endereço não existe ou ainda não foi publicado.'
            : 'Tente novamente em instantes. Se o problema persistir, entre em contato.'
        }}
      </p>

      <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <UButton size="lg" icon="i-lucide-house" @click="goHome">
          Voltar ao início
        </UButton>
        <UButton
          v-if="is404"
          size="lg"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          @click="$router.back()"
        >
          Página anterior
        </UButton>
      </div>
    </div>

    <p class="mt-16 text-xs text-gray-400 dark:text-gray-600">
      LinkLand · Seus links, sua identidade
    </p>
  </div>
</template>
