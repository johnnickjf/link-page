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

const sampleLinks = ['Meu portfólio', 'Loja / Shop', 'Newsletter semanal']
const sampleSocials = [
  'i-lucide-instagram',
  'i-lucide-youtube',
  'i-lucide-twitter',
  'i-lucide-linkedin',
]
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Nav -->
    <header class="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <span class="text-lg font-semibold tracking-tight">
        Link<span class="text-primary-500">Land</span>
      </span>
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
            <span class="text-primary-500">tudo</span> que você faz.
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

        <!-- Mockup de página pública -->
        <div class="flex justify-center">
          <div
            class="w-[280px] rounded-[2.2rem] border border-gray-200/70 bg-white p-3 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="rounded-[1.7rem] bg-gradient-to-b from-indigo-500 via-purple-500 to-fuchsia-500 px-5 pb-6 pt-8 text-center"
            >
              <div
                class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-primary-600 shadow-lg"
              >
                JC
              </div>
              <h2 class="mt-3 text-lg font-semibold text-white">@joana.cria</h2>
              <p class="text-sm text-white/80">Designer & criadora de conteúdo ✨</p>

              <div class="mt-5 space-y-2.5">
                <div
                  v-for="link in sampleLinks"
                  :key="link"
                  class="rounded-xl bg-white/95 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:scale-[1.02]"
                >
                  {{ link }}
                </div>
              </div>

              <div class="mt-5 flex justify-center gap-4 text-white/90">
                <UIcon
                  v-for="social in sampleSocials"
                  :key="social"
                  :name="social"
                  class="size-5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <h2 class="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Tudo que você precisa numa página
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
        class="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-primary-600 to-purple-600 px-6 py-14 text-center text-white shadow-xl"
      >
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
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

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-gray-500 sm:flex-row"
      >
        <span class="font-semibold text-gray-700 dark:text-gray-300">
          Link<span class="text-primary-500">Land</span>
        </span>
        <span>© {{ new Date().getFullYear() }} LinkLand. Feito para criadores.</span>
      </div>
    </footer>
  </div>
</template>
