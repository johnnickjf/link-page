// https://nuxt.com/docs/api/configuration/nuxt-config

// Container do Google Tag Manager. Sobrescrevível por ambiente para que
// staging/preview não polua as métricas de produção; string vazia desliga.
const GTM_ID = process.env.NUXT_PUBLIC_GTM_ID ?? 'GTM-P7TQPQV8'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // @nuxt/ui (v3) já traz Tailwind CSS, @nuxt/icon (marcas via Iconify),
  // @nuxt/fonts e color-mode integrados — cobre o que a seção 2 pede.
  // @nuxtjs/sitemap gera /sitemap.xml automaticamente a partir das rotas.
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  // Nomes de componente sem prefixo de pasta (ex.: <LinkBlock>, <MinimalTemplate>),
  // como na estrutura da seção 3.
  components: [{ path: '~/components', pathPrefix: false }],

  runtimeConfig: {
    public: {
      // Lê API_BASE do .env; default conforme seção 4.
      apiBase: process.env.API_BASE || 'http://localhost:8000',
    },
  },

  // Base para canonical/OG/sitemap absolutos (nuxt-site-config, via @nuxtjs/sitemap).
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://linkland.me',
    name: 'LinkLand',
  },

  // Páginas autenticadas/dinâmicas de sistema não entram no sitemap público —
  // a página pública de cada usuário (`/[slug]`) não é enumerável sem uma API
  // dedicada, então o módulo já a omite automaticamente (rota dinâmica sem fonte).
  sitemap: {
    exclude: [
      '/dashboard/**',
      '/editor/**',
      '/account',
      '/settings',
      '/admin/**',
      '/preview/**',
      '/cancelamento',
      '/support',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/resend-verification',
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      // Cada página já define seu próprio título completo ("X · LinkLand")
      // via useHead/useSeoMeta — sem titleTemplate para não duplicar o sufixo.
      title: 'LinkLand',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#6366f1' },
        { name: 'robots', content: 'index, follow' },
      ],
      // Google Tag Manager — o snippet precisa ser o mais alto possível no
      // <head>, por isso `tagPriority` negativo, e o fallback <noscript>
      // imediatamente após a abertura do <body>.
      script: GTM_ID
        ? [
            {
              key: 'gtm',
              tagPosition: 'head',
              tagPriority: -20,
              innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            },
          ]
        : [],
      noscript: GTM_ID
        ? [
            {
              key: 'gtm-noscript',
              tagPosition: 'bodyOpen',
              innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            },
          ]
        : [],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },
})
