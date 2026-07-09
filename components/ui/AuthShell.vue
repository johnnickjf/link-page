<script setup lang="ts">
// Card centralizado compartilhado pelas telas de auth (login, cadastro,
// recuperação). Ambiente com glows da marca + entrada animada — o mesmo
// acabamento da landing, para a primeira impressão não cair ao sair dela.
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 px-4 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
  >
    <!-- Ambiente: glow da paleta da marca + pontos sutis -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-44 left-1/2 h-[30rem] w-[46rem] max-w-none -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-400/25 via-purple-400/15 to-fuchsia-400/20 blur-3xl dark:from-indigo-600/20 dark:via-purple-600/10 dark:to-fuchsia-600/15"
    />
    <div aria-hidden="true" class="bg-dots pointer-events-none absolute inset-0 opacity-50 dark:opacity-30" />

    <div class="animate-rise relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
      <Logo to="/" />

      <UCard
        class="w-full border-gray-200/80 bg-white/90 shadow-xl shadow-indigo-500/5 backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/85"
      >
        <div class="mb-5 space-y-1">
          <h1 class="font-display text-2xl font-semibold tracking-tight">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>

        <slot />

        <template v-if="$slots.footer" #footer>
          <slot name="footer" />
        </template>
      </UCard>
    </div>
  </div>
</template>
