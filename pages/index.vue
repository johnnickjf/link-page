<script setup lang="ts">
// Landing pública e auto-contida (sem o header do app).
definePageMeta({ layout: false, colorMode: 'light' })

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

// Quem usa: o visitante precisa se reconhecer logo depois do hero. Cada público tem
// a própria cor de bloco e exemplos do que colocaria na página.
const audiences = [
  {
    icon: 'i-lucide-store',
    title: 'Pequenas empresas',
    text: 'Cardápio, catálogo, WhatsApp e como chegar num só lugar, para o cliente encontrar você sem procurar.',
    examples: ['Cardápio do dia', 'Pedir pelo WhatsApp', 'Como chegar'],
    card: 'bg-primary-100',
    tile: 'bg-primary-600 text-white',
  },
  {
    icon: 'i-lucide-megaphone',
    title: 'Influenciadores e criadores',
    text: 'Suas redes, parcerias e conteúdos mais recentes no único link que a bio permite.',
    examples: ['Vídeo novo', 'Cupom da parceria', 'Fale comigo'],
    card: 'bg-pink-100',
    tile: 'bg-pink-500 text-white',
  },
  {
    icon: 'i-lucide-briefcase',
    title: 'Profissionais liberais',
    text: 'Agendamento, portfólio e contato direto, numa página que passa confiança desde o primeiro clique.',
    examples: ['Agendar horário', 'Meu portfólio', 'Depoimentos'],
    card: 'bg-[#ffe3d8]',
    tile: 'bg-[#d9481f] text-white',
  },
]

// O que a seção "Por que escolher" lista ao lado do destaque (visitas e cliques).
const highlights = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Templates prontos',
    text: 'Do minimalista ao mais ousado: escolha o visual da sua marca e ajuste as cores.',
  },
  {
    icon: 'i-lucide-blocks',
    title: 'Blocos para tudo',
    text: 'Links, redes sociais, WhatsApp, e-mail, texto, imagem e mapa, na ordem que você quiser.',
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Feita para o celular',
    text: 'Publica na hora e abre rápido em qualquer aparelho, direto da bio.',
  },
  {
    icon: 'i-lucide-message-circle',
    title: 'Em português',
    text: 'Plataforma brasileira, com suporte em português e preços em reais.',
  },
]

// Barras ilustrativas do destaque: desenho do painel, sem números.
const statBars = [34, 48, 30, 62, 54, 76, 58, 88, 66, 100]

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
  <div class="app-surface min-h-screen bg-white text-gray-950">
    <!-- Skip link: acessibilidade para navegação por teclado/leitor de tela -->
    <a
      href="#conteudo-principal"
      class="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg"
    >
      Pular para o conteúdo
    </a>

    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-5">
        <Logo to="/" />
        <nav aria-label="Principal" class="flex items-center gap-1">
          <UButton to="/gamer" variant="ghost" color="neutral" class="hidden sm:inline-flex">Para gamers</UButton>
          <UButton to="/login" variant="ghost" color="neutral">Entrar</UButton>
          <UButton to="/register">Criar conta</UButton>
        </nav>
      </div>
    </header>

    <main id="conteudo-principal">
      <!-- Hero. O celular roda um template de verdade. -->
      <section aria-labelledby="hero-heading" class="overflow-hidden bg-primary-50">
        <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-10 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div>
            <p class="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
              Para empresas, criadores e profissionais
            </p>

            <h1
              id="hero-heading"
              class="mt-4 font-headline text-[clamp(2rem,10.2vw,4rem)] font-extrabold leading-[1.06] tracking-[-0.03em] lg:text-[clamp(3rem,5.4vw,4rem)]"
            >
              <!-- Duas linhas fixas, com o tamanho proporcional à tela: enquanto a fonte
                   carrega, o título não quebra em três linhas nem empurra a página. -->
              <span class="block whitespace-nowrap">
                Um link para
                <span class="text-primary-600 underline decoration-pink-400 decoration-[0.12em] underline-offset-[0.12em]">tudo</span>
              </span>
              <span class="block whitespace-nowrap">o que você faz.</span>
            </h1>

            <p class="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-gray-700">
              Reúna WhatsApp, redes sociais, site e contatos numa página profissional,
              pronta para a bio do Instagram e do TikTok. A alternativa brasileira ao
              Linktree, no ar em minutos.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <UButton
                to="/register"
                size="xl"
                trailing-icon="i-lucide-arrow-right"
                class="min-h-12 justify-center font-semibold"
              >
                Criar minha página grátis
              </UButton>
              <UButton to="/login" size="xl" variant="outline" color="neutral" class="min-h-12 justify-center bg-white">
                Já tenho conta
              </UButton>
            </div>

            <ul class="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-medium text-gray-700">
              <li v-for="item in ['Grátis para começar', 'Sem cartão de crédito', 'Pronta em minutos']" :key="item" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-circle-check" class="size-4 text-primary-600" aria-hidden="true" />
                {{ item }}
              </li>
            </ul>
          </div>

          <TemplateStage :start="1" />
        </div>
      </section>

      <!-- Para quem é -->
      <section aria-labelledby="para-quem-heading" class="py-14 sm:py-24">
        <div class="mx-auto max-w-6xl px-5">
          <h2 id="para-quem-heading" class="max-w-2xl text-balance font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Do pequeno negócio ao criador de conteúdo
          </h2>
          <ul class="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-3">
            <li
              v-for="(item, i) in audiences"
              :key="item.title"
              v-reveal="i * 60"
              class="flex flex-col rounded-3xl p-6 sm:p-7"
              :class="item.card"
            >
              <span class="flex size-12 items-center justify-center rounded-2xl" :class="item.tile">
                <UIcon :name="item.icon" class="size-6" aria-hidden="true" />
              </span>
              <h3 class="mt-5 font-headline text-xl font-bold">{{ item.title }}</h3>
              <p class="mt-2 flex-1 text-pretty leading-relaxed text-gray-800">{{ item.text }}</p>
              <ul class="mt-5 space-y-2" aria-hidden="true">
                <li
                  v-for="example in item.examples"
                  :key="example"
                  class="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-sm"
                >
                  {{ example }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <!-- Como funciona -->
      <section aria-labelledby="como-funciona-heading" class="mx-auto grid max-w-6xl gap-8 px-5 pb-14 sm:pb-24 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <h2 id="como-funciona-heading" class="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <p class="mt-3 max-w-sm text-lg text-gray-600">
            Três passos entre você e sua página no ar.
          </p>
        </div>

        <ol class="border-t border-gray-200">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            v-reveal="i * 60"
            class="grid grid-cols-[3.25rem_1fr] gap-x-3 border-b border-gray-200 py-6 sm:grid-cols-[4.5rem_1fr]"
          >
            <span class="flex size-10 items-center justify-center rounded-full bg-primary-600 font-headline text-lg font-bold text-white tabular-nums sm:size-12 sm:text-xl" aria-hidden="true">
              {{ i + 1 }}
            </span>
            <div>
              <h3 class="font-headline text-lg font-semibold sm:text-xl">{{ step.title }}</h3>
              <p class="mt-1.5 max-w-lg text-pretty leading-relaxed text-gray-600">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </section>

      <!-- Por que escolher a LinkLand -->
      <section aria-labelledby="recursos-heading" class="bg-primary-700 py-14 text-white sm:py-24">
        <div class="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
          <div class="lg:sticky lg:top-24 lg:self-start">
            <h2 id="recursos-heading" class="text-balance font-headline text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Por que escolher a LinkLand
            </h2>
            <p class="mt-4 max-w-md text-pretty text-lg text-white/95">
              O essencial para ter uma presença online organizada, sem depender de ninguém.
            </p>
            <UButton
              to="/register"
              size="xl"
              color="neutral"
              class="mt-7 min-h-12 w-full justify-center bg-white font-semibold text-primary-800 hover:bg-primary-50 active:bg-primary-100 sm:w-auto"
              trailing-icon="i-lucide-arrow-right"
            >
              Criar minha página grátis
            </UButton>
          </div>

          <div>
            <!-- Destaque: o que o dono da página acompanha no painel -->
            <div class="grid items-end gap-6 rounded-3xl bg-white p-6 text-gray-950 sm:grid-cols-[1fr_1fr] sm:p-8">
              <div>
                <span class="flex size-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
                  <UIcon name="i-lucide-chart-column" class="size-5" aria-hidden="true" />
                </span>
                <h3 class="mt-4 font-headline text-xl font-bold">Visitas e cliques</h3>
                <p class="mt-1.5 text-pretty leading-relaxed text-gray-700">
                  Veja quantas pessoas abriram sua página e em quais links clicaram, com contagem anônima.
                </p>
              </div>
              <div class="flex h-28 items-end gap-1.5 sm:h-36" aria-hidden="true">
                <span
                  v-for="(height, i) in statBars"
                  :key="i"
                  class="flex-1 rounded-t-md"
                  :class="i === statBars.length - 1 ? 'bg-pink-500' : 'bg-primary-200'"
                  :style="{ height: `${height}%` }"
                />
              </div>
            </div>

            <ul class="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              <li v-for="item in highlights" :key="item.title" class="flex gap-4">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-200 text-gray-950">
                  <UIcon :name="item.icon" class="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 class="font-headline text-lg font-semibold">{{ item.title }}</h3>
                  <p class="mt-1 text-pretty leading-relaxed text-white/95">{{ item.text }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Grátis vs Premium -->
      <section aria-labelledby="planos-heading" class="bg-primary-50 py-14 sm:py-24">
        <div class="mx-auto max-w-6xl px-5">
          <div class="max-w-2xl">
            <h2 id="planos-heading" class="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Grátis para começar, Premium para ir além
            </h2>
            <p class="mt-3 text-lg text-gray-700">
              Comece sem gastar nada. Faça upgrade só quando fizer sentido para você.
            </p>
          </div>

          <div class="mt-8 grid items-stretch gap-4 sm:mt-12 lg:grid-cols-2">
            <!-- Free (no celular vem depois do Premium) -->
            <div class="order-2 flex flex-col rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:order-none">
              <p class="font-semibold text-gray-700">Free</p>
              <p class="mt-1 font-headline text-4xl font-bold tracking-tight">R$0</p>
              <p class="mt-2 text-sm text-gray-700">Sem cartão de crédito e sem prazo</p>
              <ul class="mt-6 flex-1 space-y-3">
                <li v-for="f in freeFeatures" :key="f" class="flex items-start gap-2.5">
                  <UIcon name="i-lucide-circle-check" class="mt-1 size-4 shrink-0 text-primary-600" aria-hidden="true" />
                  <span class="text-gray-800">{{ f }}</span>
                </li>
              </ul>
              <UButton to="/register" block size="xl" variant="outline" class="mt-8 min-h-12 font-semibold">
                Começar grátis
              </UButton>
            </div>

            <!-- Premium (aparece primeiro no celular) -->
            <div class="order-1 flex flex-col rounded-3xl bg-primary-700 p-6 text-white sm:p-8 lg:order-none">
              <div class="flex items-center justify-between gap-3">
                <p class="font-semibold">Premium</p>
                <span class="rounded-full bg-pink-200 px-3 py-1 text-xs font-bold text-gray-950">Mais popular</span>
              </div>
              <p class="mt-1 font-headline text-4xl font-bold tracking-tight">
                R$1,99<span class="font-sans text-base font-normal tracking-normal text-white/95"> no primeiro mês</span>
              </p>
              <p class="mt-2 text-sm text-white/95">
                R$19,90/mês nos meses seguintes · cancele quando quiser
              </p>
              <ul class="mt-6 flex-1 space-y-3">
                <li v-for="f in premiumFeatures" :key="f" class="flex items-start gap-2.5">
                  <UIcon name="i-lucide-circle-check" class="mt-1 size-4 shrink-0 text-pink-300" aria-hidden="true" />
                  <span>{{ f }}</span>
                </li>
              </ul>
              <!-- O ?referral_code é capturado pelo watcher global (app.vue) e
                   salvo no localStorage: o cadastro já nasce com o cupom. -->
              <UButton
                to="/register?referral_code=DESCONTO"
                block
                size="xl"
                color="neutral"
                class="mt-8 min-h-12 bg-white font-semibold text-primary-800 hover:bg-primary-50 active:bg-primary-100"
              >
                Experimentar o Premium
              </UButton>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section aria-labelledby="faq-heading" class="py-14 sm:py-24">
        <div class="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          <div class="lg:sticky lg:top-24 lg:self-start">
            <h2 id="faq-heading" class="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Perguntas frequentes
            </h2>
            <p class="mt-3 max-w-sm text-lg text-gray-600">
              Ainda com dúvidas sobre a LinkLand? Talvez a resposta esteja aqui.
            </p>
          </div>
          <UAccordion :items="faqs" type="multiple" />
        </div>
      </section>

      <!-- CTA final -->
      <section aria-labelledby="cta-final-heading" class="mx-auto max-w-6xl px-5 pb-14 sm:pb-24">
        <div class="relative overflow-hidden rounded-3xl bg-primary-600 px-6 py-12 text-white sm:px-12 sm:py-16">
          <div class="absolute -right-12 -top-20 size-64 rounded-full bg-primary-500" aria-hidden="true" />
          <div class="absolute -bottom-10 right-32 size-20 rounded-full bg-pink-400" aria-hidden="true" />
          <div class="relative">
            <h2 id="cta-final-heading" class="max-w-2xl text-balance font-headline text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Crie a sua página de links em minutos
            </h2>
            <p class="mt-3 max-w-xl text-pretty text-lg">
              Sem complicação e sem cartão de crédito. Monte, escolha o template e publique.
            </p>
            <UButton
              to="/register"
              size="xl"
              color="neutral"
              class="mt-7 min-h-12 w-full justify-center bg-white font-semibold text-primary-800 hover:bg-primary-50 active:bg-primary-100 sm:w-auto"
              trailing-icon="i-lucide-arrow-right"
            >
              Começar agora, é grátis
            </UButton>
          </div>
        </div>
      </section>

      <!-- Convite gamer: discreto, no fim, para quem joga -->
      <section aria-labelledby="gamer-heading" class="border-t border-gray-200">
        <div class="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="gamer-heading" class="font-headline text-xl font-semibold">
              Joga? Seu perfil de jogador também mora aqui.
            </h2>
            <p class="mt-1 max-w-xl text-pretty text-gray-600">
              IDs da Steam, PSN, Xbox e Riot, os jogos que você mais joga e seu canal.
            </p>
            <ul class="mt-3 flex flex-wrap gap-3 text-gray-500" aria-hidden="true">
              <li v-for="icon in gamerIcons" :key="icon">
                <UIcon :name="icon" class="size-5" />
              </li>
            </ul>
          </div>
          <UButton
            to="/gamer"
            size="lg"
            variant="outline"
            color="neutral"
            class="shrink-0 justify-center"
            trailing-icon="i-lucide-arrow-right"
          >
            Ver o perfil gamer
          </UButton>
        </div>
      </section>

      <!-- TrackPath -->
      <section class="border-t border-gray-200 bg-gray-50 py-10">
        <div class="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-5 sm:flex-row sm:items-center">
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
              <p class="font-semibold text-gray-900">
                Precisa de estatísticas avançadas?
              </p>
              <p class="mt-0.5 text-sm text-gray-600">
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
            class="shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:border-gray-400"
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
