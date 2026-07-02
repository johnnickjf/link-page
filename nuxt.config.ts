// https://nuxt.com/docs/api/configuration/nuxt-config
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
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },
})
