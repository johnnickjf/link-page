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

const freeFeatures = [
  '1 página de links publicada',
  'Até 10 blocos por página',
  'Templates Minimal, Classic e Dark',
  'Blocos de Link, Social, WhatsApp e E-mail',
  'Página responsiva, rápida e com SEO básico',
]

const premiumFeatures = [
  'Até 10 páginas e 100 blocos por página',
  'Todos os templates, incluindo Gradient, Neon e Pixel Art',
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
      'Até 10 páginas e 100 blocos por página, todos os templates (incluindo Gradient, Neon e Pixel Art), blocos de Texto e Imagem, fontes e fundo personalizados, QR Code da página e a opção de remover a marca "Criado por LinkLand" — por R$19,90/mês.',
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
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Skip link: acessibilidade para navegação por teclado/leitor de tela -->
    <a
      href="#conteudo-principal"
      class="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg"
    >
      Pular para o conteúdo
    </a>

    <!-- Nav (sticky + glassy: acompanha o scroll sem pesar) -->
    <header
      class="sticky top-0 z-40 border-b border-gray-200/60 bg-white/75 backdrop-blur-md dark:border-white/5 dark:bg-gray-950/70"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo to="/" />
        <nav aria-label="Principal" class="flex items-center gap-2">
          <UButton to="/login" variant="ghost" color="neutral">Entrar</UButton>
          <UButton
            to="/register"
            class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm shadow-indigo-500/25 transition hover:opacity-90"
          >
            Criar conta
          </UButton>
        </nav>
      </div>
    </header>

    <main id="conteudo-principal">
      <!-- Hero -->
      <section
        aria-labelledby="hero-heading"
        class="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-gray-950 dark:to-gray-950"
      >
        <!-- Ambiente: glows da paleta da marca + pontos (profundidade sem peso) -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -left-32 -top-32 size-[26rem] rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-600/20"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -right-24 top-1/3 size-[22rem] rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-600/15"
        />
        <div aria-hidden="true" class="bg-dots pointer-events-none absolute inset-0 opacity-60 dark:opacity-40" />

        <div
          class="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:py-24 lg:grid-cols-2 lg:gap-12"
        >
          <div class="text-center lg:text-left">
            <span
              class="animate-rise inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-primary-600 shadow-sm backdrop-blur-sm dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-300"
            >
              <span class="animate-pulse-dot size-1.5 rounded-full bg-primary-500" aria-hidden="true" />
              A alternativa brasileira ao Linktree
            </span>

            <h1
              id="hero-heading"
              class="animate-rise mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight [animation-delay:80ms] sm:text-5xl lg:text-6xl"
            >
              Um link para
              <span class="text-brand-gradient">tudo</span> o que você faz.
            </h1>

            <p
              class="animate-rise mx-auto mt-5 max-w-xl text-lg text-gray-600 [animation-delay:160ms] dark:text-gray-400 lg:mx-0"
            >
              Crie sua página de links grátis: reúna redes sociais, WhatsApp e
              todo o seu conteúdo num único link para a bio do Instagram e do
              TikTok. Bonita, rápida e no ar em minutos.
            </p>

            <div
              class="animate-rise mt-8 flex flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row sm:justify-center lg:justify-start"
            >
              <UButton
                to="/register"
                size="xl"
                trailing-icon="i-lucide-arrow-right"
                class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Criar minha página grátis
              </UButton>
              <UButton to="/login" size="xl" variant="subtle" color="neutral">
                Já tenho conta
              </UButton>
            </div>

            <ul class="animate-rise mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm text-gray-500 [animation-delay:320ms] dark:text-gray-400 lg:mx-0 lg:justify-start">
              <li class="flex items-center gap-1.5">
                <UIcon name="i-lucide-check" class="size-4 text-green-500" aria-hidden="true" />
                Grátis para sempre
              </li>
              <li class="flex items-center gap-1.5">
                <UIcon name="i-lucide-check" class="size-4 text-green-500" aria-hidden="true" />
                Sem cartão de crédito
              </li>
              <li class="flex items-center gap-1.5">
                <UIcon name="i-lucide-check" class="size-4 text-green-500" aria-hidden="true" />
                Pronta em minutos
              </li>
            </ul>
          </div>

          <!-- Imagem da homepage: glow atrás + flutuação lenta -->
          <div class="relative flex justify-center">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-400/35 via-purple-400/25 to-fuchsia-400/30 blur-3xl dark:from-indigo-600/30 dark:via-purple-600/20 dark:to-fuchsia-600/25"
            />
            <picture class="animate-float relative">
              <source srcset="/image-iphone.webp" type="image/webp" />
              <img
                src="/image-iphone.png"
                alt="Exemplo de página de links da LinkLand aberta num celular, com links, redes sociais e botão de WhatsApp"
                width="600"
                height="1144"
                fetchpriority="high"
                class="w-full max-w-[170px] drop-shadow-2xl sm:max-w-[280px]"
              />
            </picture>
          </div>
        </div>
      </section>

      <!-- Como funciona -->
      <section aria-labelledby="como-funciona-heading" class="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div v-reveal class="text-center">
          <span
            class="inline-flex items-center gap-1.5 rounded-full border border-primary-200/70 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600 dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-300"
          >
            <UIcon name="i-lucide-rocket" class="size-3.5" aria-hidden="true" />
            Simples e rápido
          </span>
          <h2 id="como-funciona-heading" class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            Três passos entre você e sua página de links no ar.
          </p>
        </div>

        <ol class="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          <!-- Linha conectando os passos (só desktop) -->
          <div
            aria-hidden="true"
            class="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-primary-200 dark:border-primary-900/60 sm:block"
          />
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            v-reveal="i * 120"
            class="relative text-center"
          >
            <div class="relative mx-auto w-fit">
              <div
                class="relative z-10 flex size-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-indigo-500/25"
              >
                <UIcon :name="step.icon" class="size-7" aria-hidden="true" />
              </div>
              <span
                class="absolute -right-2 -top-2 z-20 flex size-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-primary-600 shadow ring-1 ring-gray-200 dark:bg-gray-900 dark:text-primary-300 dark:ring-gray-700"
              >
                {{ i + 1 }}
              </span>
            </div>
            <h3 class="mt-4 font-display font-semibold">{{ step.title }}</h3>
            <p class="mx-auto mt-2 max-w-[16rem] text-sm text-gray-600 dark:text-gray-400">{{ step.text }}</p>
          </li>
        </ol>
      </section>

      <!-- Por que escolher a LinkLand (recursos + público + diferenciais, num só bloco) -->
      <section
        aria-labelledby="recursos-heading"
        class="relative overflow-hidden bg-gray-50 px-5 py-16 dark:bg-gray-900/40 sm:py-24"
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -right-32 -top-24 size-[24rem] rounded-full bg-purple-400/15 blur-3xl dark:bg-purple-600/10"
        />
        <div class="relative mx-auto max-w-6xl">
          <div v-reveal class="text-center">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-primary-200/70 bg-white px-3 py-1 text-xs font-semibold text-primary-600 dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-300"
            >
              <UIcon name="i-lucide-heart" class="size-3.5" aria-hidden="true" />
              Feita para você
            </span>
            <h2 id="recursos-heading" class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Por que escolher a LinkLand
            </h2>
            <p class="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
              A alternativa 100% brasileira ao Linktree, para criadores, empresas
              e profissionais que querem uma bio bonita e fácil de manter.
            </p>
          </div>

          <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="(item, i) in highlights"
              :key="item.title"
              v-reveal="i * 90"
              class="card-lift rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-white/5 dark:bg-gray-900"
            >
              <div
                class="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-indigo-500/20"
              >
                <UIcon :name="item.icon" class="size-6" aria-hidden="true" />
              </div>
              <h3 class="mt-4 font-display font-semibold">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Grátis vs Premium -->
      <section aria-labelledby="planos-heading" class="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div v-reveal class="text-center">
          <span
            class="inline-flex items-center gap-1.5 rounded-full border border-primary-200/70 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600 dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-300"
          >
            <UIcon name="i-lucide-sparkles" class="size-3.5" aria-hidden="true" />
            Planos
          </span>
          <h2 id="planos-heading" class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Grátis para começar, Premium para ir além
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            Comece sem gastar nada. Faça upgrade só quando fizer sentido para você.
          </p>
        </div>

        <div class="mx-auto mt-12 grid max-w-3xl items-start gap-6 lg:grid-cols-2">
          <!-- Free (no celular vem depois do Premium) -->
          <div
            v-reveal="100"
            class="card-lift order-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:order-none"
          >
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Free</p>
            <p class="mt-1 font-display text-3xl font-bold tracking-tight">R$0</p>
            <ul class="mt-5 space-y-3 text-sm">
              <li v-for="f in freeFeatures" :key="f" class="flex items-start gap-2.5">
                <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-green-500" aria-hidden="true" />
                <span class="text-gray-600 dark:text-gray-400">{{ f }}</span>
              </li>
            </ul>
            <UButton to="/register" block variant="subtle" color="neutral" class="mt-6">
              Começar grátis
            </UButton>
          </div>

          <!-- Premium: borda em gradiente da marca (aparece primeiro no celular) -->
          <div v-reveal class="order-1 relative lg:order-none">
            <span
              class="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white shadow-md shadow-indigo-500/30"
            >
              Mais popular
            </span>
            <div class="bg-brand-gradient rounded-2xl p-[1.5px] shadow-xl shadow-indigo-500/15">
              <div class="rounded-[calc(1rem-1.5px)] bg-white p-6 dark:bg-gray-900">
                <p class="text-sm font-medium text-primary-600 dark:text-primary-400">Premium</p>
                <p class="mt-1 font-display text-3xl font-bold tracking-tight">
                  R$1,99<span class="text-base font-normal text-gray-500"> no primeiro mês</span>
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  R$19,90/mês nos meses seguintes · cancele quando quiser
                </p>
                <ul class="mt-5 space-y-3 text-sm">
                  <li v-for="f in premiumFeatures" :key="f" class="flex items-start gap-2.5">
                    <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary-500" aria-hidden="true" />
                    <span class="text-gray-600 dark:text-gray-400">{{ f }}</span>
                  </li>
                </ul>
                <!-- O ?referral_code é capturado pelo watcher global (app.vue) e
                     salvo no localStorage — o cadastro já nasce com o cupom. -->
                <UButton
                  to="/register?referral_code=DESCONTO"
                  block
                  class="mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/25 transition hover:opacity-90"
                >
                  Experimentar o Premium
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section aria-labelledby="faq-heading" class="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <div v-reveal class="text-center">
          <span
            class="inline-flex items-center gap-1.5 rounded-full border border-primary-200/70 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600 dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-300"
          >
            <UIcon name="i-lucide-message-circle-question" class="size-3.5" aria-hidden="true" />
            Dúvidas
          </span>
          <h2 id="faq-heading" class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Perguntas frequentes
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            Ainda com dúvidas sobre a LinkLand? Talvez a resposta esteja aqui.
          </p>
        </div>

        <div
          v-reveal
          class="mt-10 rounded-2xl border border-gray-200/80 bg-white px-5 py-2 shadow-sm sm:px-6 dark:border-white/5 dark:bg-gray-900"
        >
          <UAccordion :items="faqs" type="multiple" />
        </div>
      </section>

      <!-- CTA final -->
      <section class="px-5 pb-20" aria-labelledby="cta-final-heading">
        <div
          v-reveal
          class="bg-brand-gradient relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-5 py-12 text-center text-white shadow-2xl shadow-indigo-500/25 sm:px-8 sm:py-16"
        >
          <!-- Textura de profundidade dentro do CTA -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div class="relative">
            <h2 id="cta-final-heading" class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Crie a sua página de links em minutos
            </h2>
            <p class="mx-auto mt-3 max-w-xl text-white/85">
              Sem complicação e sem cartão de crédito. Monte, escolha o template e
              publique — sua bio nunca mais vai ser só uma linha de texto.
            </p>
            <UButton
              to="/register"
              size="xl"
              color="neutral"
              variant="solid"
              class="mt-8 shadow-lg transition hover:-translate-y-0.5"
              trailing-icon="i-lucide-arrow-right"
            >
              Começar agora, é grátis
            </UButton>
          </div>
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
    <footer class="border-t border-gray-200 dark:border-gray-800">
      <div class="mx-auto max-w-6xl px-5 py-10">
        <div class="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-xs">
            <Logo to="/" sm />
            <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Todos os seus links numa página só — bonita, rápida e brasileira.
            </p>
          </div>

          <div class="flex gap-14 text-sm">
            <nav aria-label="Produto">
              <p class="font-semibold text-gray-900 dark:text-gray-100">Produto</p>
              <ul class="mt-3 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <NuxtLink to="/register" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Criar conta
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/login" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Entrar
                  </NuxtLink>
                </li>
              </ul>
            </nav>
            <nav aria-label="Links institucionais">
              <p class="font-semibold text-gray-900 dark:text-gray-100">Legal</p>
              <ul class="mt-3 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <NuxtLink to="/termos" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Termos de Uso
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/privacidade" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Privacidade
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div
          class="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-sm text-gray-500 sm:flex-row dark:border-gray-800/80"
        >
          <span>© {{ new Date().getFullYear() }} LinkLand</span>
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
              width="16"
              height="16"
              loading="lazy"
              decoding="async"
              class="size-4"
            />
            Rastreado por TrackPath
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
