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

const features = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Templates com identidade de verdade',
    text: 'Modelos modernos — do minimalista ao retrô Pixel Art — para sua página de links não parecer genérica.',
  },
  {
    icon: 'i-lucide-blocks',
    title: 'Blocos flexíveis para tudo',
    text: 'Links, redes sociais, botão de WhatsApp, texto e imagem. Arraste para reordenar como quiser.',
  },
  {
    icon: 'i-lucide-zap',
    title: 'Publicação instantânea',
    text: 'Sua página de links no ar assim que você publicar — sem esperar aprovação nem revisão.',
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Pensado primeiro pro celular',
    text: 'Rápida, leve e responsiva: abre na hora direto da bio do Instagram e do TikTok.',
  },
]

const audiences = [
  {
    icon: 'i-lucide-clapperboard',
    title: 'Criadores de conteúdo',
    text: 'Centralize redes sociais, vídeos e parcerias num link único para a bio.',
  },
  {
    icon: 'i-lucide-store',
    title: 'Empresas e comércio local',
    text: 'Catálogo, WhatsApp, endereço e redes sociais numa página só, fácil de manter.',
  },
  {
    icon: 'i-lucide-briefcase',
    title: 'Profissionais liberais',
    text: 'Advogados, dentistas, personal trainers e consultores com uma bio personalizada e profissional.',
  },
  {
    icon: 'i-lucide-graduation-cap',
    title: 'Infoprodutores e afiliados',
    text: 'Reúna cursos, e-books e links de afiliado num agregador de links organizado.',
  },
  {
    icon: 'i-lucide-music',
    title: 'Artistas e músicos',
    text: 'Shows, playlists no Spotify, clipes e redes sociais num único link para divulgar em qualquer lugar.',
  },
  {
    icon: 'i-lucide-party-popper',
    title: 'Eventos e datas especiais',
    text: 'Casamentos, formaturas e eventos com uma página bonita para convites, RSVP e informações.',
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

const differentiators = [
  {
    icon: 'i-lucide-flag',
    title: 'Feita para o Brasil',
    text: 'Suporte e produto em português, pensados para criadores e negócios brasileiros — não é só uma tradução.',
  },
  {
    icon: 'i-lucide-gift',
    title: 'Grátis de verdade',
    text: 'O plano gratuito da LinkLand é completo o suficiente para começar sem esbarrar em bloqueios logo de cara.',
  },
  {
    icon: 'i-lucide-sparkles',
    title: 'Visual que impressiona',
    text: 'Templates com personalidade — do minimalista ao Pixel Art — em vez de um link genérico e sem graça.',
  },
  {
    icon: 'i-lucide-gauge',
    title: 'Leve e instantânea',
    text: 'Páginas otimizadas para carregar rápido em qualquer celular, sem travar a experiência de quem clicou na sua bio.',
  },
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

    <!-- Nav -->
    <header class="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Logo to="/" />
      <nav aria-label="Principal" class="flex items-center gap-2">
        <UButton to="/login" variant="ghost" color="neutral">Entrar</UButton>
        <UButton to="/register">Criar conta</UButton>
      </nav>
    </header>

    <main id="conteudo-principal">
      <!-- Hero -->
      <section
        aria-labelledby="hero-heading"
        class="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-gray-950 dark:to-gray-950"
      >
        <div
          class="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2"
        >
          <div class="text-center lg:text-left">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
            >
              <UIcon name="i-lucide-sparkles" aria-hidden="true" />
              A alternativa brasileira ao Linktree
            </span>

            <h1
              id="hero-heading"
              class="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Um link para
              <span class="text-brand-gradient">tudo</span> o que você faz.
            </h1>

            <p
              class="mx-auto mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-400 lg:mx-0"
            >
              Crie sua página de links grátis: reúna redes sociais, WhatsApp e
              todo o seu conteúdo num único link para a bio do Instagram e do
              TikTok. Bonita, rápida e no ar em minutos.
            </p>

            <div
              class="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center"
            >
              <UButton to="/register" size="xl" trailing-icon="i-lucide-arrow-right">
                Criar minha página grátis
              </UButton>
              <UButton to="/login" size="xl" variant="subtle" color="neutral">
                Já tenho conta
              </UButton>
            </div>

            <ul class="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400 lg:mx-0 lg:justify-start">
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

          <!-- Imagem da homepage -->
          <div class="flex justify-center">
            <picture>
              <source srcset="/image-iphone.webp" type="image/webp" />
              <img
                src="/image-iphone.png"
                alt="Exemplo de página de links da LinkLand aberta num celular, com links, redes sociais e botão de WhatsApp"
                width="700"
                height="1050"
                fetchpriority="high"
                class="w-full max-w-[220px] drop-shadow-2xl sm:max-w-[330px]"
              />
            </picture>
          </div>
        </div>
      </section>

      <!-- Como funciona -->
      <section aria-labelledby="como-funciona-heading" class="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 id="como-funciona-heading" class="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Como funciona
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
          Três passos entre você e sua página de links no ar.
        </p>

        <ol class="mt-12 grid gap-8 sm:grid-cols-3">
          <li v-for="(step, i) in steps" :key="step.title" class="relative text-center">
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
            >
              <UIcon :name="step.icon" class="size-7" aria-hidden="true" />
            </div>
            <span class="mt-3 block text-xs font-semibold uppercase tracking-wide text-primary-500">
              Passo {{ i + 1 }}
            </span>
            <h3 class="mt-1 font-semibold">{{ step.title }}</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ step.text }}</p>
          </li>
        </ol>
      </section>

      <!-- Features -->
      <section aria-labelledby="recursos-heading" class="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 id="recursos-heading" class="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Tudo o que você precisa numa página de links
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
          Simples de montar, bonito de mostrar — sem depender de outra pessoa.
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
              <UIcon :name="feature.icon" class="size-6" aria-hidden="true" />
            </div>
            <h3 class="mt-4 font-semibold">{{ feature.title }}</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ feature.text }}
            </p>
          </div>
        </div>
      </section>

      <!-- Para quem é a LinkLand -->
      <section aria-labelledby="para-quem-heading" class="bg-gray-50 px-5 py-16 dark:bg-gray-900/40 sm:py-20">
        <div class="mx-auto max-w-6xl">
          <h2 id="para-quem-heading" class="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Para quem é a LinkLand
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            Se você tem links para compartilhar, a LinkLand é para você.
          </p>

          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="audience in audiences"
              :key="audience.title"
              class="flex items-start gap-4 rounded-2xl bg-white p-5 dark:bg-gray-900"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
              >
                <UIcon :name="audience.icon" class="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 class="font-semibold">{{ audience.title }}</h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ audience.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Grátis vs Premium -->
      <section aria-labelledby="planos-heading" class="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 id="planos-heading" class="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Grátis para começar, Premium para ir além
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
          Comece sem gastar nada. Faça upgrade só quando fizer sentido para você.
        </p>

        <div class="mx-auto mt-12 grid max-w-3xl gap-6 lg:grid-cols-2">
          <div class="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
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

          <div class="relative rounded-2xl ring-2 ring-primary-500/50">
            <span
              class="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white shadow"
            >
              Mais popular
            </span>
            <div class="rounded-2xl p-6">
              <p class="text-sm font-medium text-primary-600 dark:text-primary-400">Premium</p>
              <p class="mt-1 font-display text-3xl font-bold tracking-tight">
                R$19,90<span class="text-base font-normal text-gray-500">/mês</span>
              </p>
              <ul class="mt-5 space-y-3 text-sm">
                <li v-for="f in premiumFeatures" :key="f" class="flex items-start gap-2.5">
                  <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary-500" aria-hidden="true" />
                  <span class="text-gray-600 dark:text-gray-400">{{ f }}</span>
                </li>
              </ul>
              <UButton to="/register" block class="mt-6">
                Experimentar o Premium
              </UButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Diferenciais -->
      <section aria-labelledby="diferenciais-heading" class="bg-gray-50 px-5 py-16 dark:bg-gray-900/40 sm:py-20">
        <div class="mx-auto max-w-6xl">
          <h2 id="diferenciais-heading" class="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Por que escolher a LinkLand
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            Uma alternativa ao Linktree pensada do zero para quem fala português.
          </p>

          <div class="mt-12 grid gap-6 sm:grid-cols-2">
            <div
              v-for="item in differentiators"
              :key="item.title"
              class="flex items-start gap-4 rounded-2xl bg-white p-5 dark:bg-gray-900"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
              >
                <UIcon :name="item.icon" class="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 class="font-semibold">{{ item.title }}</h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section aria-labelledby="faq-heading" class="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <h2 id="faq-heading" class="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Perguntas frequentes
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
          Ainda com dúvidas sobre a LinkLand? Talvez a resposta esteja aqui.
        </p>

        <UAccordion :items="faqs" type="multiple" class="mt-10" />
      </section>

      <!-- CTA final -->
      <section class="px-5 pb-20" aria-labelledby="cta-final-heading">
        <div
          class="bg-brand-gradient mx-auto max-w-5xl rounded-3xl px-5 py-10 text-center text-white shadow-xl sm:px-8 sm:py-14"
        >
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
            class="mt-8"
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
    <footer class="border-t border-gray-200 dark:border-gray-800">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-gray-500 sm:flex-row"
      >
        <Logo to="/" sm />
        <nav aria-label="Links institucionais" class="flex items-center gap-4">
          <NuxtLink to="/termos" class="transition hover:text-gray-900 dark:hover:text-gray-100">
            Termos de Uso
          </NuxtLink>
          <NuxtLink to="/privacidade" class="transition hover:text-gray-900 dark:hover:text-gray-100">
            Privacidade
          </NuxtLink>
        </nav>
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
    </footer>
  </div>
</template>
