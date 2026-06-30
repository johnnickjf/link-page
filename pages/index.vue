<script setup lang="ts">
// Landing pública e auto-contida (sem o header do app).
definePageMeta({ layout: false })

// Logado vai pro dashboard; visitante vê a landing.
const auth = useAuthStore()
if (auth.isAuthenticated) {
  await navigateTo('/dashboard')
}

useSeoMeta({
  title: 'LinkLand · Sua página de links, do seu jeito',
  description:
    'Crie uma página de links linda e responsiva em minutos. Reúna seus links, redes e WhatsApp num só lugar e publique em linkland.com/seunome.',
  ogTitle: 'LinkLand · Sua página de links, do seu jeito',
  ogDescription:
    'Reúna seus links, redes e WhatsApp num só lugar. Templates lindos, publicação instantânea.',
})

const features = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Templates lindos',
    text: 'Modelos com identidade de verdade — escolha e publique. Nada de cara de planilha.',
  },
  {
    icon: 'i-lucide-blocks',
    title: 'Blocos flexíveis',
    text: 'Links, redes sociais, botão de WhatsApp, texto e imagem. Arraste para reordenar.',
  },
  {
    icon: 'i-lucide-zap',
    title: 'Publicação instantânea',
    text: 'Sua página no ar em linkland.com/seunome assim que você publicar.',
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Pensado pro celular',
    text: 'Rápido, leve e otimizado para abrir direto da bio do Instagram e TikTok.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Nav -->
    <header class="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Logo to="/" />
      <nav class="flex items-center gap-2">
        <UButton to="/login" variant="ghost" color="neutral">Entrar</UButton>
        <UButton to="/register">Criar conta</UButton>
      </nav>
    </header>

    <!-- Hero -->
    <section
      class="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-gray-950 dark:to-gray-950"
    >
      <div
        class="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2"
      >
        <div class="text-center lg:text-left">
          <span
            class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
          >
            <UIcon name="i-lucide-sparkles" />
            Sua bio, finalmente bonita
          </span>

          <h1
            class="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Um link para
            <span class="text-brand-gradient">tudo</span> o que você faz.
          </h1>

          <p
            class="mx-auto mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-400 lg:mx-0"
          >
            Reúna seus links, redes sociais e WhatsApp numa página única e
            responsiva. Escolha um template, publique e compartilhe na bio.
          </p>

          <div
            class="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center"
          >
            <UButton to="/register" size="xl" trailing-icon="i-lucide-arrow-right">
              Criar minha página
            </UButton>
            <UButton to="/login" size="xl" variant="subtle" color="neutral">
              Já tenho conta
            </UButton>
          </div>

          <p class="mt-4 text-sm text-gray-500">Grátis para começar.</p>
        </div>

        <!-- Imagem da homepage -->
        <div class="flex justify-center">
          <img
            src="/image-iphone.png"
            alt="Exemplo de página LinkLand no celular"
            class="w-full max-w-[220px] drop-shadow-2xl sm:max-w-[330px]"
          />
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <h2 class="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Tudo o que você precisa numa página
      </h2>
      <p class="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
        Simples de montar, bonito de mostrar.
      </p>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-2xl border border-gray-200 p-6 transition hover:border-primary-300 hover:shadow-lg dark:border-gray-800 dark:hover:border-primary-800"
        >
          <div
            class="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
          >
            <UIcon :name="feature.icon" class="size-6" />
          </div>
          <h3 class="mt-4 font-semibold">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ feature.text }}
          </p>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="px-5 pb-20">
      <div
        class="bg-brand-gradient mx-auto max-w-5xl rounded-3xl px-5 py-10 text-center text-white shadow-xl sm:px-8 sm:py-14"
      >
        <h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Crie a sua em minutos
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-white/85">
          Sem complicação. Monte, escolha o template e publique.
        </p>
        <UButton
          to="/register"
          size="xl"
          color="neutral"
          variant="solid"
          class="mt-8"
          trailing-icon="i-lucide-arrow-right"
        >
          Começar agora
        </UButton>
      </div>
    </section>

    <!-- TrackPath -->
    <section class="border-t border-gray-100 bg-gray-50 px-5 py-10 dark:border-gray-800 dark:bg-gray-900/40">
      <div
        class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 sm:flex-row"
      >
        <div class="flex items-center gap-3">
          <img
            src="https://trackpath.com.br/assets/logo/favicon.png"
            alt="TrackPath"
            class="size-9 rounded-lg"
          />
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100">
              Precisa de estatísticas avançadas?
            </p>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Acompanhe cliques, origens de tráfego e conversões com o TrackPath.
            </p>
          </div>
        </div>
        <a
          href="https://lp.trackpath.com.br"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conhecer o TrackPath"
          data-gtm-category="landing"
          data-gtm-action="click_trackpath_cta"
          data-gtm-label="TrackPath"
          class="shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500"
        >
          Conhecer o TrackPath →
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-gray-500 sm:flex-row"
      >
        <Logo to="/" sm />
        <a
          href="https://trackpath.com.br"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rastreado por TrackPath"
          data-gtm-category="rodape"
          data-gtm-action="click_rodape"
          data-gtm-label="TrackPath"
          class="inline-flex items-center gap-1.5 transition hover:text-gray-900 dark:hover:text-gray-100"
        >
          <img
            src="https://trackpath.com.br/assets/logo/favicon.png"
            alt="TrackPath"
            class="size-4"
          />
          Rastreado por TrackPath
        </a>
      </div>
    </footer>
  </div>
</template>
