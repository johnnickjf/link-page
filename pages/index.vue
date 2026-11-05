<script setup lang="ts">
// Landing pública e auto-contida (sem o header do app).
definePageMeta({ layout: false })

// Logado vai pro dashboard; visitante vê a landing.
const auth = useAuthStore()
if (auth.isAuthenticated) {
  await navigateTo('/dashboard')
}

const SITE_URL = 'https://linkland.me'

useSeoMeta({
  title: 'LinkLand · Página de Links Grátis para Instagram, TikTok e Bio',
  description:
    'Crie sua página de links grátis em minutos. A alternativa brasileira ao Linktree: reúna links, redes sociais e WhatsApp num só lugar e publique na bio do Instagram e TikTok.',
  ogTitle: 'LinkLand · Sua página de links, do jeito brasileiro',
  ogDescription:
    'Reúna todos os seus links, redes sociais e WhatsApp numa página única, bonita e rápida. Grátis para começar, sem cartão de crédito.',
  ogType: 'website',
  ogUrl: SITE_URL,
  ogImage: `${SITE_URL}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'LinkLand — todos os seus links, uma página só.',
  ogLocale: 'pt_BR',
  twitterCard: 'summary_large_image',
  twitterTitle: 'LinkLand · Sua página de links, do jeito brasileiro',
  twitterDescription:
    'A alternativa brasileira ao Linktree. Crie sua página de links grátis e publique na bio em minutos.',
  twitterImage: `${SITE_URL}/og-image.png`,
})

useHead({
  link: [{ rel: 'canonical', href: SITE_URL }],
})

// ---------------------------------------------------------------------------
// Conteúdo da página (dados usados nas seções abaixo).
// ---------------------------------------------------------------------------

const steps = [
  {
    icon: 'i-lucide-user-plus',
    title: 'Crie sua conta grátis',
    text: 'Cadastre-se em segundos com seu e-mail. Sem cartão de crédito, sem pegadinha.',
  },
  {
    icon: 'i-lucide-blocks',
    title: 'Monte sua página',
    text: 'Adicione links, redes sociais, WhatsApp, texto e imagens. Escolha um template e personalize as cores.',
  },
  {
    icon: 'i-lucide-rocket',
    title: 'Publique e compartilhe',
    text: 'Sua página fica no ar em linkland.me/seu-nome. Cole o link na bio do Instagram, TikTok ou onde quiser.',
  },
]

// Seção única "Por que escolher a LinkLand": mistura recursos, público e
// diferenciais num só bloco enxuto (evita repetir 3 grids parecidos seguidos).
const highlights = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Templates com identidade',
    text: 'Do minimalista ao retrô Pixel Art — nada de página com cara de link genérico.',
  },
  {
    icon: 'i-lucide-blocks',
    title: 'Blocos para tudo',
    text: 'Links, redes sociais, WhatsApp, texto e imagem — para criadores, empresas e profissionais liberais.',
  },
  {
    icon: 'i-lucide-gauge',
    title: 'Leve e instantânea',
    text: 'Publica na hora e abre rápido em qualquer celular, direto da bio do Instagram e do TikTok.',
  },
  {
    icon: 'i-lucide-gift',
    title: 'Grátis de verdade',
    text: 'O plano gratuito é completo o bastante para começar sem travar sua criatividade.',
  },
]

// Miniaturas dos templates no destaque "Templates com identidade".
const showcaseSwatches = [
  { name: 'Minimal', bg: '#ffffff', bar: '#e2e8f0' },
  { name: 'Classic', bg: '#f8f5ee', bar: '#d6d3d1' },
  { name: 'Dark', bg: '#18181b', bar: '#3f3f46' },
  { name: 'Gradient', bg: 'linear-gradient(160deg, #4338ca, #7e22ce 48%, #be185d)', bar: 'rgb(255 255 255 / 0.3)' },
  { name: 'Neon', bg: '#050507', bar: '#22d3ee' },
  { name: 'Pixel', bg: '#0a0a16', bar: '#22c55e' },
]

const gamerIcons = [
  'i-simple-icons-steam',
  'i-simple-icons-playstation',
  'i-simple-icons-xbox',
  'i-simple-icons-nintendo',
  'i-simple-icons-riotgames',
  'i-simple-icons-discord',
  'i-simple-icons-twitch',
  'i-simple-icons-youtube',
]

const freeFeatures = [
  '1 página de links publicada',
  'Até 10 blocos por página',
  'Templates Minimal, Classic e Dark',
  'Blocos de Link, Social, WhatsApp e E-mail',
  'Página responsiva, rápida e com SEO básico',
  'Contagem anônima de visitas e cliques',
]

const premiumFeatures = [
  'Até 10 páginas e 100 blocos por página',
  'Templates Gradient, Neon e Pixel Art, além dos gratuitos',
  'Blocos de Texto e Imagem, fontes e fundo personalizados',
  'QR Code da sua página para divulgar offline',
  'Remova a marca "Criado por LinkLand"',
]

const faqs = [
  {
    label: 'O que é a LinkLand?',
    content:
      'A LinkLand é uma plataforma brasileira que permite criar uma página única para reunir todos os seus links, redes sociais e WhatsApp. É a sua página de links para colocar na bio do Instagram, TikTok ou qualquer outra rede.',
  },
  {
    label: 'Como funciona uma página de links?',
    content:
      'Você cria uma conta, monta sua página adicionando blocos (links, redes sociais, WhatsApp, texto e imagem), escolhe um template e publica. Sua página fica disponível em linkland.me/seu-nome, pronta para compartilhar na bio.',
  },
  {
    label: 'A LinkLand é gratuita?',
    content:
      'Sim. O plano gratuito permite criar 1 página com até 10 blocos, templates Minimal, Classic e Dark, e os blocos essenciais (Link, Social, WhatsApp e E-mail) — sem cartão de crédito e sem taxas escondidas.',
  },
  {
    label: 'Qual a diferença entre a LinkLand e o Linktree?',
    content:
      'A LinkLand é uma alternativa brasileira ao Linktree, com suporte em português, um plano gratuito mais completo e templates modernos — incluindo temas exclusivos como o Pixel Art — com foco em design bonito e simplicidade de uso.',
  },
  {
    label: 'Posso usar no Instagram?',
    content:
      'Sim. É exatamente para isso que a LinkLand existe: crie sua página e cole o link no campo de site da bio do Instagram para transformar cliques em resultado.',
  },
  {
    label: 'Funciona no TikTok?',
    content:
      'Funciona. Basta colar o link da sua página LinkLand na bio do TikTok — ou de qualquer outra rede que aceite apenas um link.',
  },
  {
    label: 'Posso adicionar WhatsApp?',
    content:
      'Sim. A LinkLand tem um bloco de WhatsApp dedicado, com botão flutuante e mensagem pré-preenchida, para quem clicar já cair direto numa conversa com você.',
  },
  {
    label: 'Posso personalizar minha página?',
    content:
      'Sim. Você pode escolher entre vários templates, ajustar cores, reordenar os blocos e, no plano Premium, personalizar fontes e fundo (cor, gradiente ou imagem).',
  },
  {
    label: 'Posso usar domínio próprio?',
    content:
      'No momento cada página tem um endereço próprio no formato linkland.me/seu-nome — fácil de lembrar e de compartilhar. Domínio personalizado ainda não está disponível.',
  },
  {
    label: 'Preciso instalar algum aplicativo?',
    content:
      'Não. A LinkLand funciona inteiramente pelo navegador, tanto para criar quanto para visualizar sua página — sem instalar nada no celular ou computador.',
  },
  {
    label: 'Minha página funciona no celular?',
    content:
      'Sim. Todos os templates são responsivos e otimizados para carregar rápido em qualquer smartphone, já que a maioria dos cliques vem direto da bio de redes sociais no celular.',
  },
  {
    label: 'A LinkLand é segura?',
    content:
      'Sim. Sua conta é protegida por senha criptografada, conexão HTTPS e verificação de e-mail no cadastro.',
  },
  {
    label: 'Posso alterar meus links quando quiser?',
    content:
      'Sim, quantas vezes quiser. Edite, adicione ou remova blocos a qualquer momento — as alterações ficam no ar assim que você salva, sem precisar reenviar nada para ninguém.',
  },
  {
    label: 'Quais recursos estão disponíveis gratuitamente?',
    content:
      '1 página com até 10 blocos, templates Minimal, Classic e Dark, blocos de Link, Social, WhatsApp e E-mail, e uma página responsiva com SEO básico — tudo sem custo.',
  },
  {
    label: 'O que está incluso no plano Premium?',
    content:
      'Até 10 páginas e 100 blocos por página, os templates Gradient, Neon e Pixel Art, blocos de Texto e Imagem, fontes e fundo personalizados, QR Code da página e a opção de remover a marca "Criado por LinkLand" — por R$19,90/mês.',
  },
]

// FAQPage (JSON-LD) — mesmo conteúdo exibido na seção de FAQ, para rich snippets.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.label,
    acceptedAnswer: { '@type': 'Answer', text: f.content },
  })),
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LinkLand',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    'Plataforma brasileira para criar páginas de links (link na bio) para Instagram, TikTok e redes sociais.',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LinkLand',
  url: SITE_URL,
  inLanguage: 'pt-BR',
}

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(organizationJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(websiteJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(faqJsonLd) },
  ],
})
</script>

<template>
  <div class="app-surface min-h-screen bg-[#faf9f6] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Skip link: acessibilidade para navegação por teclado/leitor de tela -->
    <a
      href="#conteudo-principal"
      class="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg"
    >
      Pular para o conteúdo
    </a>

    <header class="on-ink sticky top-0 z-40 border-b border-white/10 bg-[#0d0b14]/85 text-white backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Logo to="/" />
        <nav aria-label="Principal" class="flex items-center gap-1">
          <UButton to="/gamer" variant="ghost" color="neutral" class="hidden text-white hover:bg-white/10 active:bg-white/10 sm:inline-flex">Para gamers</UButton>
          <UButton to="/login" variant="ghost" color="neutral" class="text-white hover:bg-white/10 active:bg-white/10">Entrar</UButton>
          <UButton to="/register" color="neutral" class="bg-white text-gray-950 hover:bg-white/90 active:bg-white/90">
            Criar conta
          </UButton>
        </nav>
      </div>
    </header>

    <main id="conteudo-principal">
      <!-- Hero: o palco. Os celulares rodam os templates de verdade. -->
      <section aria-labelledby="hero-heading" class="stage-bg overflow-hidden">
        <div class="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-[1.08fr_1fr] lg:gap-6">
          <div class="text-center lg:text-left">
            <p class="animate-rise text-sm font-medium tracking-wide text-white/65">
              A alternativa brasileira ao Linktree
            </p>

            <h1
              id="hero-heading"
              class="animate-rise mt-4 font-headline text-[clamp(2.9rem,7.4vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] [animation-delay:80ms]"
            >
              Um link para
              <span class="text-brand-gradient">tudo</span>
              o que você faz.
            </h1>

            <p class="animate-rise mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75 [animation-delay:160ms] lg:mx-0">
              Crie sua página de links grátis: reúna redes sociais, WhatsApp e
              todo o seu conteúdo num único link para a bio do Instagram e do
              TikTok. Bonita, rápida e no ar em minutos.
            </p>

            <div class="animate-rise mt-8 flex flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row sm:justify-center lg:justify-start">
              <UButton
                to="/register"
                size="xl"
                color="neutral"
                trailing-icon="i-lucide-arrow-right"
                class="bg-white font-semibold text-gray-950 transition hover:-translate-y-0.5 hover:bg-white active:bg-white"
              >
                Criar minha página grátis
              </UButton>
              <UButton to="/login" size="xl" variant="ghost" color="neutral" class="text-white hover:bg-white/10 active:bg-white/10">
                Já tenho conta
              </UButton>
            </div>

            <ul class="animate-rise mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm text-white/65 [animation-delay:320ms] lg:mx-0 lg:justify-start">
              <li v-for="item in ['Grátis para sempre', 'Sem cartão de crédito', 'Pronta em minutos']" :key="item" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-check" class="size-4 text-emerald-400" aria-hidden="true" />
                {{ item }}
              </li>
            </ul>
          </div>

          <TemplateStage class="animate-rise [animation-delay:200ms]" />
        </div>
      </section>

      <!-- Como funciona -->
      <section aria-labelledby="como-funciona-heading" class="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:py-28 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div v-reveal class="lg:sticky lg:top-24 lg:self-start">
          <h2 id="como-funciona-heading" class="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Como funciona
          </h2>
          <p class="mt-4 max-w-sm text-lg text-gray-600 dark:text-gray-400">
            Três passos entre você e sua página de links no ar.
          </p>
        </div>

        <ol class="border-t border-gray-200 dark:border-white/10">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            v-reveal="i * 100"
            class="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-gray-200 py-7 sm:grid-cols-[5.5rem_1fr] dark:border-white/10"
          >
            <span class="font-headline text-4xl font-bold leading-none text-primary-500 tabular-nums sm:text-6xl" aria-hidden="true">
              {{ i + 1 }}
            </span>
            <div>
              <h3 class="font-headline text-xl font-semibold sm:text-2xl">{{ step.title }}</h3>
              <p class="mt-2 max-w-lg text-pretty leading-relaxed text-gray-600 dark:text-gray-400">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </section>

      <!-- Por que escolher a LinkLand -->
      <section aria-labelledby="recursos-heading" class="bg-white py-20 sm:py-28 dark:bg-gray-900/40">
        <div class="mx-auto max-w-6xl px-5">
          <div v-reveal class="max-w-2xl">
            <h2 id="recursos-heading" class="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Por que escolher a LinkLand
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
              A alternativa 100% brasileira ao Linktree, para criadores, empresas
              e profissionais que querem uma bio bonita e fácil de manter.
            </p>
          </div>

          <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div v-reveal class="stage-bg overflow-hidden rounded-3xl p-7 sm:col-span-2 lg:col-span-3 lg:row-span-2">
              <h3 class="font-headline text-2xl font-semibold sm:text-3xl">{{ highlights[0]!.title }}</h3>
              <p class="mt-3 max-w-md leading-relaxed text-white/75">{{ highlights[0]!.text }}</p>
              <ul class="mt-8 grid grid-cols-3 gap-2.5" aria-hidden="true">
                <li v-for="t in showcaseSwatches" :key="t.name">
                  <div class="flex h-24 flex-col justify-end gap-1 rounded-xl p-2 sm:h-32" :style="{ background: t.bg, boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.12)' }">
                    <span class="block h-2 rounded-sm" :style="{ background: t.bar }" />
                    <span class="block h-2 rounded-sm" :style="{ background: t.bar }" />
                  </div>
                  <span class="mt-1.5 block text-xs text-white/65">{{ t.name }}</span>
                </li>
              </ul>
            </div>

            <div v-reveal="60" class="rounded-3xl border border-gray-200 p-7 lg:col-span-3 dark:border-white/10">
              <h3 class="font-headline text-xl font-semibold">{{ highlights[1]!.title }}</h3>
              <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{{ highlights[1]!.text }}</p>
              <ul class="mt-4 flex flex-wrap gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300" aria-hidden="true">
                <li v-for="b in ['Link', 'Rede social', 'WhatsApp', 'E-mail', 'Texto', 'Imagem', 'Mapa']" :key="b" class="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-white/10">{{ b }}</li>
              </ul>
            </div>

            <div v-reveal="120" class="rounded-3xl border border-gray-200 p-7 lg:col-span-3 dark:border-white/10">
              <h3 class="font-headline text-xl font-semibold">Visitas e cliques</h3>
              <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">
                Veja quantas pessoas abriram sua página e em quais links clicaram, com contagem anônima.
              </p>
              <div class="mt-4 flex h-12 items-end gap-1" aria-hidden="true">
                <span v-for="(h, i) in [30, 45, 28, 60, 52, 74, 66, 90, 58, 100, 82, 94]" :key="i" class="flex-1 rounded-t bg-primary-500" :style="{ height: `${h}%` }" />
              </div>
            </div>

            <div v-reveal="60" class="rounded-3xl border border-gray-200 p-7 lg:col-span-3 dark:border-white/10">
              <h3 class="font-headline text-xl font-semibold">{{ highlights[2]!.title }}</h3>
              <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{{ highlights[2]!.text }}</p>
            </div>

            <div v-reveal="120" class="rounded-3xl border border-gray-200 p-7 lg:col-span-3 dark:border-white/10">
              <h3 class="font-headline text-xl font-semibold">{{ highlights[3]!.title }}</h3>
              <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{{ highlights[3]!.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Convite gamer -->
      <section aria-labelledby="gamer-heading" class="mx-auto max-w-6xl px-5 pt-20 sm:pt-28">
        <div v-reveal class="stage-bg grid items-center gap-8 overflow-hidden rounded-3xl p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="gamer-heading" class="font-headline text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Joga? Seu perfil de jogador também mora aqui.
            </h2>
            <p class="mt-4 max-w-xl text-pretty text-lg text-white/75">
              Reúna seus IDs da Steam, PSN, Xbox e Riot, os jogos que você mais joga,
              conquistas e seu canal, com temas feitos para isso.
            </p>
            <UButton
              to="/gamer"
              size="xl"
              color="neutral"
              class="mt-7 bg-white font-semibold text-gray-950 transition hover:-translate-y-0.5 hover:bg-white active:bg-white"
              trailing-icon="i-lucide-arrow-right"
            >
              Ver o perfil gamer
            </UButton>
          </div>
          <ul class="flex flex-wrap gap-2.5 lg:justify-end" aria-hidden="true">
            <li v-for="icon in gamerIcons" :key="icon" class="flex size-14 items-center justify-center rounded-2xl bg-white/10">
              <UIcon :name="icon" class="size-7" />
            </li>
          </ul>
        </div>
      </section>

      <!-- Grátis vs Premium -->
      <section aria-labelledby="planos-heading" class="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div v-reveal class="max-w-2xl">
          <h2 id="planos-heading" class="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Grátis para começar, Premium para ir além
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Comece sem gastar nada. Faça upgrade só quando fizer sentido para você.
          </p>
        </div>

        <div class="mt-12 grid items-stretch gap-4 lg:grid-cols-2">
          <!-- Free (no celular vem depois do Premium) -->
          <div v-reveal="80" class="order-2 flex flex-col rounded-3xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-gray-900 lg:order-none">
            <p class="font-medium text-gray-600 dark:text-gray-400">Free</p>
            <p class="mt-1 font-headline text-5xl font-bold tracking-tight">R$0</p>
            <ul class="mt-6 flex-1 space-y-3">
              <li v-for="f in freeFeatures" :key="f" class="flex items-start gap-2.5">
                <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span class="text-gray-700 dark:text-gray-300">{{ f }}</span>
              </li>
            </ul>
            <UButton to="/register" block size="lg" variant="subtle" color="neutral" class="mt-8">
              Começar grátis
            </UButton>
          </div>

          <!-- Premium (aparece primeiro no celular) -->
          <div v-reveal class="stage-bg order-1 flex flex-col rounded-3xl p-8 lg:order-none">
            <div class="flex items-center justify-between gap-3">
              <p class="font-medium text-white/75">Premium</p>
              <span class="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-950">Mais popular</span>
            </div>
            <p class="mt-1 font-headline text-5xl font-bold tracking-tight">
              R$1,99<span class="font-sans text-base font-normal tracking-normal text-white/70"> no primeiro mês</span>
            </p>
            <p class="mt-2 text-sm text-white/70">
              R$19,90/mês nos meses seguintes · cancele quando quiser
            </p>
            <ul class="mt-6 flex-1 space-y-3">
              <li v-for="f in premiumFeatures" :key="f" class="flex items-start gap-2.5">
                <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span class="text-white/85">{{ f }}</span>
              </li>
            </ul>
            <!-- O ?referral_code é capturado pelo watcher global (app.vue) e
                 salvo no localStorage: o cadastro já nasce com o cupom. -->
            <UButton
              to="/register?referral_code=DESCONTO"
              block
              size="lg"
              color="neutral"
              class="mt-8 bg-white font-semibold text-gray-950 hover:bg-white/90 active:bg-white/90"
            >
              Experimentar o Premium
            </UButton>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section aria-labelledby="faq-heading" class="border-t border-gray-200 py-20 sm:py-28 dark:border-white/10">
        <div class="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          <div v-reveal class="lg:sticky lg:top-24 lg:self-start">
            <h2 id="faq-heading" class="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Perguntas frequentes
            </h2>
            <p class="mt-4 max-w-sm text-lg text-gray-600 dark:text-gray-400">
              Ainda com dúvidas sobre a LinkLand? Talvez a resposta esteja aqui.
            </p>
          </div>
          <div v-reveal>
            <UAccordion :items="faqs" type="multiple" />
          </div>
        </div>
      </section>

      <!-- CTA final -->
      <section class="mx-auto max-w-6xl px-5 pb-20" aria-labelledby="cta-final-heading">
        <div v-reveal class="stage-bg overflow-hidden rounded-3xl px-6 py-16 sm:px-12 sm:py-24">
          <h2 id="cta-final-heading" class="max-w-3xl text-balance font-headline text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Crie a sua página de links em minutos
          </h2>
          <p class="mt-5 max-w-xl text-pretty text-lg text-white/75">
            Sem complicação e sem cartão de crédito. Monte, escolha o template e
            publique — sua bio nunca mais vai ser só uma linha de texto.
          </p>
          <UButton
            to="/register"
            size="xl"
            color="neutral"
            class="mt-8 bg-white font-semibold text-gray-950 transition hover:-translate-y-0.5 hover:bg-white active:bg-white"
            trailing-icon="i-lucide-arrow-right"
          >
            Começar agora, é grátis
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
              width="36"
              height="36"
              loading="lazy"
              decoding="async"
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
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>
