<script setup lang="ts">
// Telas de auth (login, cadastro, recuperação): formulário de um lado e, no
// desktop, o palco da landing com um template real do outro. No celular a vitrine
// nem é carregada: quem está ali quer entrar rápido.
defineProps<{ title: string; subtitle?: string }>()

const isDesktop = useMediaQuery('(min-width: 1024px)')
</script>

<template>
  <div class="app-surface flex min-h-screen bg-[#faf9f6] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <div class="flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-10">
      <div class="animate-rise flex w-full max-w-sm flex-col gap-6">
        <Logo to="/" />

        <div>
          <h1 class="font-headline text-4xl font-bold tracking-tight">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="mt-2 text-gray-600 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>

        <slot />

        <div v-if="$slots.footer" class="border-t border-gray-200 pt-4 dark:border-white/10">
          <slot name="footer" />
        </div>
      </div>
    </div>

    <aside
      class="stage-bg hidden w-[46%] shrink-0 flex-col items-center justify-center gap-10 overflow-hidden px-10 py-10 lg:flex"
      aria-hidden="true"
    >
      <p class="max-w-sm text-balance text-center font-headline text-3xl font-bold leading-tight tracking-tight">
        Um link para <span class="text-brand-gradient">tudo</span> o que você faz.
      </p>
      <ClientOnly>
        <TemplateStage v-if="isDesktop" compact :start="3" />
      </ClientOnly>
    </aside>
  </div>
</template>
