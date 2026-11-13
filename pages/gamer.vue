<script setup lang="ts">
// Home gamer: mesma linguagem da home, com o plano Free x Gamer.
definePageMeta({ layout: false })

const SITE_URL = 'https://linkland.me'
const auth = useAuthStore()

const title = 'Perfil Gamer · LinkLand | Seus IDs, jogos e canais em um link'
const description =
  'Monte seu perfil de jogador: IDs da Steam, PSN, Xbox e Riot, jogos mais jogados, conquistas e canal da Twitch em um único link. Grátis para começar.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${SITE_URL}/gamer`,
  ogImage: `${SITE_URL}/og-image.png`,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: `${SITE_URL}/gamer` }],
  meta: [{ name: 'theme-color', content: '#080420' }],
})

// Quem já tem conta vai direto para os planos; quem não tem, cria o perfil.
// O botão do plano leva o cupom do primeiro mês, como o "Experimentar o Premium" da home.
const signupTo = computed(() => (auth.isAuthenticated ? '/dashboard' : '/register?kind=gamer'))
const gamerPlanTo = computed(() =>
  auth.isAuthenticated ? '/settings' : `/register?kind=gamer&referral_code=${FIRST_MONTH_COUPON}`,
)

const PLATFORM_ICONS = [
  { icon: 'i-simple-icons-steam', name: 'Steam' },
  { icon: 'i-simple-icons-playstation', name: 'PlayStation' },
  { icon: 'i-simple-icons-xbox', name: 'Xbox' },
  { icon: 'i-simple-icons-nintendo', name: 'Nintendo' },
  { icon: 'i-simple-icons-riotgames', name: 'Riot' },
  { icon: 'i-simple-icons-epicgames', name: 'Epic Games' },
  { icon: 'i-simple-icons-battledotnet', name: 'Battle.net' },
  { icon: 'i-simple-icons-discord', name: 'Discord' },
  { icon: 'i-simple-icons-twitch', name: 'Twitch' },
  { icon: 'i-simple-icons-youtube', name: 'YouTube' },
  { icon: 'i-simple-icons-kick', name: 'Kick' },
]

const THEMES = [
  { name: 'Arcade', tag: 'Grátis', bg: 'linear-gradient(180deg, #12052e, #2a0a4a)', bar: '#ff4fd8' },
  { name: 'HUD', tag: 'Gamer', bg: '#0b0e0a', bar: '#facc15' },
  { name: 'Esports', tag: 'Gamer', bg: 'linear-gradient(115deg, #0a0a0c 62%, #ef4444 62%)', bar: '#3f3f46' },
  { name: 'Cozy', tag: 'Gamer', bg: '#f7f0e1', bar: '#cfe3c8' },
  { name: 'Terminal', tag: 'Gamer', bg: '#050806', bar: '#39ff88' },
  { name: 'Quest', tag: 'Gamer', bg: 'radial-gradient(70% 60% at 50% 0%, #4c2a7a, #14101d 75%)', bar: '#c084fc' },
]

const faqs = [
  {
    label: 'Preciso ligar minha conta da Steam, PSN ou Riot?',
    content:
      'Não. Você digita seu ID e, se quiser, o link do perfil. Nas plataformas sem página pública, como PSN e Riot, o visitante copia o ID com um toque.',
  },
  {
    label: 'O perfil gamer é grátis?',
    content:
      'Sim. No plano Free você usa IDs de jogo, lista até 3 jogos, escolhe o tema Arcade e acompanha nível e XP. O plano Gamer soma os outros temas, conquistas, player de stream e cabeçalho com gamertag.',
  },
  {
    label: 'Como funciona o nível?',
    content:
      'Sua página ganha 1 XP por visitante no dia e 2 XP por clique em um link, com um teto diário para o número valer de verdade. Suas próprias visitas não contam. Mostrar o nível na página é opcional.',
  },
  {
    label: 'O player da Twitch deixa a página lenta?',
    content:
      'Não. O player só carrega quando o visitante toca nele. Até lá, a página continua leve e nenhum serviço externo é acionado.',
  },
  {
    label: 'Já tenho uma página na LinkLand. Perco alguma coisa?',
    content:
      'Nada muda até você querer. Dá para ligar o perfil gamer em qualquer página, no editor, e tudo o que já está nela continua igual.',
  },
]

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.label,
        acceptedAnswer: { '@type': 'Answer', text: f.content },
      })),
    }),
  }],
})
</script>

<template>
  <div class="app-surface gamer-surface min-h-screen bg-white text-gray-950 dark:bg-[#0c0a1f] dark:text-white">
    <a
      href="#conteudo-principal"
      class="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg"
    >
      Pular para o conteúdo
    </a>

    <header class="on-ink site-header sticky top-0 z-40 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Logo to="/" />
        <nav aria-label="Principal" class="flex items-center gap-1">
          <UButton v-if="!auth.isAuthenticated" to="/login" variant="ghost" color="neutral" class="text-white hover:bg-white/10 active:bg-white/10">Entrar</UButton>
          <UButton :to="signupTo" color="neutral" class="btn-accent font-semibold">
            {{ auth.isAuthenticated ? 'Meu painel' : 'Criar perfil' }}
          </UButton>
        </nav>
      </div>
    </header>

    <main id="conteudo-principal">
      <section aria-labelledby="hero-heading" class="stage-bg overflow-hidden">
        <div class="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-[1.08fr_1fr] lg:gap-6">
          <div class="text-center lg:text-left">
            <p class="animate-rise text-sm font-medium tracking-wide text-white/90">Perfil Gamer da LinkLand</p>
            <h1
              id="hero-heading"
              class="animate-rise mt-4 font-headline text-[clamp(2.9rem,7.4vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em] [animation-delay:80ms]"
            >
              Seu perfil de <span class="text-brand-accent">jogador</span> em um link só.
            </h1>
            <p class="animate-rise mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/95 [animation-delay:160ms] lg:mx-0">
              IDs de todas as plataformas, os jogos que você mais joga, suas conquistas e
              seu canal. Coloque na bio, no Discord e no perfil da live, e nunca mais
              repita seu Riot ID no chat.
            </p>
            <div class="animate-rise mt-8 flex flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row sm:justify-center lg:justify-start">
              <UButton
                :to="signupTo"
                size="xl"
                color="neutral"
                trailing-icon="i-lucide-arrow-right"
                class="btn-accent font-semibold transition hover:-translate-y-0.5"
              >
                Criar meu perfil grátis
              </UButton>
              <UButton to="#planos" size="xl" variant="ghost" color="neutral" class="text-white hover:bg-white/10 active:bg-white/10">
                Ver planos
              </UButton>
            </div>
          </div>

          <TemplateStage gamer class="animate-rise [animation-delay:200ms]" />
        </div>
      </section>

      <!-- Plataformas -->
      <section aria-label="Plataformas" class="border-b border-gray-200 dark:border-white/10">
        <ul class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-7 gap-y-4 px-5 py-8 text-gray-800 dark:text-gray-100">
          <li v-for="p in PLATFORM_ICONS" :key="p.name" class="flex items-center gap-2 text-sm font-medium">
            <UIcon :name="p.icon" class="size-5" aria-hidden="true" />
            {{ p.name }}
          </li>
        </ul>
      </section>

      <!-- O que cabe -->
      <section aria-labelledby="recursos-heading" class="py-20 sm:py-28">
        <div class="mx-auto max-w-6xl px-5">
          <h2 id="recursos-heading" v-reveal class="max-w-2xl font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Tudo o que alguém precisa para jogar com você
          </h2>

          <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div v-reveal class="rounded-3xl border border-gray-200 bg-white p-7 lg:col-span-3 dark:border-white/10 dark:bg-[#17123a]">
              <h3 class="font-headline text-2xl font-semibold">IDs que se copiam com um toque</h3>
              <p class="mt-2 leading-relaxed text-gray-700 dark:text-gray-200">
                PSN, Riot e Nintendo não têm página pública de perfil. Aqui, seu amigo toca e o ID já vai para a área de transferência.
              </p>
              <div class="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-white/10" aria-hidden="true">
                <UIcon name="i-simple-icons-riotgames" class="size-5" />
                <span class="min-w-0 flex-1">
                  <span class="block text-xs text-gray-700 dark:text-gray-200">Riot ID</span>
                  <span class="block font-semibold">SeuNick#BR1</span>
                </span>
                <UIcon name="i-lucide-copy" class="size-4 text-gray-700 dark:text-gray-200" />
              </div>
            </div>

            <div v-reveal="60" class="stage-bg overflow-hidden rounded-3xl p-7 lg:col-span-3">
              <h3 class="font-headline text-2xl font-semibold">Temas feitos para isso</h3>
              <p class="mt-2 leading-relaxed text-white/95">Do fliperama à fazendinha: escolha o clima do seu perfil.</p>
              <ul class="mt-5 grid grid-cols-3 gap-2.5" aria-hidden="true">
                <li v-for="t in THEMES" :key="t.name">
                  <div class="flex h-20 flex-col justify-end gap-1 rounded-xl p-2" :style="{ background: t.bg, boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.12)' }">
                    <span class="block h-1.5 rounded-sm" :style="{ background: t.bar }" />
                    <span class="block h-1.5 rounded-sm" :style="{ background: t.bar }" />
                  </div>
                  <span class="mt-1.5 block text-xs text-white/90">{{ t.name }}</span>
                </li>
              </ul>
            </div>

            <div v-reveal="60" class="rounded-3xl border border-gray-200 bg-white p-7 lg:col-span-2 dark:border-white/10 dark:bg-[#17123a]">
              <h3 class="font-headline text-xl font-semibold">Mais jogados</h3>
              <p class="mt-2 leading-relaxed text-gray-700 dark:text-gray-200">
                Capa, elo e horas jogadas de cada jogo, para mostrar o que você joga de verdade.
              </p>
            </div>
            <div v-reveal="100" class="rounded-3xl border border-gray-200 bg-white p-7 lg:col-span-2 dark:border-white/10 dark:bg-[#17123a]">
              <h3 class="font-headline text-xl font-semibold">Conquistas</h3>
              <p class="mt-2 leading-relaxed text-gray-700 dark:text-gray-200">
                Campeonatos, recordes e títulos em destaque, do seu jeito.
              </p>
            </div>
            <div v-reveal="140" class="rounded-3xl border border-gray-200 bg-white p-7 sm:col-span-2 lg:col-span-2 dark:border-white/10 dark:bg-[#17123a]">
              <h3 class="font-headline text-xl font-semibold">Live na página</h3>
              <p class="mt-2 leading-relaxed text-gray-700 dark:text-gray-200">
                Player da Twitch e do YouTube e widget do Discord, que só carregam quando o visitante toca.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Nivel -->
      <section aria-labelledby="nivel-heading" class="bg-[#e9fff5] py-20 sm:py-28 dark:bg-[#0d1c2e]">
        <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16">
          <div v-reveal>
            <h2 id="nivel-heading" class="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Sua página sobe de nível
            </h2>
            <p class="mt-4 max-w-lg text-pretty text-lg text-gray-700 dark:text-gray-200">
              Cada visitante vale 1 XP e cada clique em um link vale 2 XP, com um teto por
              dia para o número valer de verdade. Suas próprias visitas não contam, e você
              escolhe se o nível aparece na página.
            </p>
          </div>
          <div v-reveal class="stage-bg rounded-3xl p-8" aria-hidden="true">
            <div class="flex items-baseline justify-between">
              <span class="font-headline text-4xl font-bold">Nv. 12</span>
              <span class="text-sm tabular-nums text-white/90">5.230 / 5.690 XP</span>
            </div>
            <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
              <div class="btn-accent h-full w-[76%] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- Planos -->
      <section id="planos" aria-labelledby="planos-heading" class="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:py-28">
        <h2 id="planos-heading" v-reveal class="max-w-2xl font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Comece grátis, suba de plano quando quiser
        </h2>

        <div class="mt-12 grid items-stretch gap-4 lg:grid-cols-2">
          <div v-reveal="80" class="order-2 flex flex-col rounded-3xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-[#17123a] lg:order-none">
            <p class="font-medium text-gray-700 dark:text-gray-200">Free</p>
            <p class="mt-1 font-headline text-5xl font-bold tracking-tight">R$0</p>
            <ul class="mt-6 flex-1 space-y-3">
              <li v-for="f in GAMER_FREE_FEATURES" :key="f" class="flex items-start gap-2.5">
                <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                <span class="text-gray-800 dark:text-gray-100">{{ f }}</span>
              </li>
            </ul>
            <UButton :to="signupTo" block size="lg" variant="subtle" color="neutral" class="mt-8">Começar grátis</UButton>
          </div>

          <div v-reveal class="stage-bg order-1 flex flex-col rounded-3xl p-8 lg:order-none" data-testid="gamer-plan-card">
            <p class="font-medium text-white/95">Gamer</p>
            <p class="mt-1 font-headline text-5xl font-bold tracking-tight">
              R${{ brl(GAMER_PRICE_FIRST_MONTH) }}<span class="font-sans text-base font-normal tracking-normal text-white/90"> no primeiro mês</span>
            </p>
            <p class="mt-2 text-sm text-white/90">
              Depois, R${{ brl(GAMER_PRICE_MONTHLY) }}/mês ou R${{ brl(GAMER_PRICE_YEARLY) }}/ano · cancele quando quiser
            </p>
            <ul class="mt-6 flex-1 space-y-3">
              <li v-for="f in GAMER_HIGHLIGHTS" :key="f" class="flex items-start gap-2.5">
                <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 stage-check" aria-hidden="true" />
                <span class="text-white">{{ f }}</span>
              </li>
            </ul>
            <UButton
              :to="gamerPlanTo"
              block
              size="lg"
              color="neutral"
              class="mt-8 btn-accent font-semibold"
            >
              Quero o plano Gamer
            </UButton>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section aria-labelledby="faq-heading" class="border-t border-gray-200 py-20 sm:py-28 dark:border-white/10">
        <div class="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          <h2 id="faq-heading" v-reveal class="font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:sticky lg:top-24 lg:self-start">
            Perguntas frequentes
          </h2>
          <div v-reveal>
            <UAccordion :items="faqs" type="multiple" />
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-5 pb-20" aria-labelledby="cta-final-heading">
        <div v-reveal class="stage-bg overflow-hidden rounded-3xl px-6 py-16 sm:px-12 sm:py-24">
          <h2 id="cta-final-heading" class="max-w-3xl text-balance font-headline text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Monte seu perfil antes da próxima partida
          </h2>
          <UButton
            :to="signupTo"
            size="xl"
            color="neutral"
            class="mt-8 btn-accent font-semibold transition hover:-translate-y-0.5"
            trailing-icon="i-lucide-arrow-right"
          >
            Criar meu perfil grátis
          </UButton>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
