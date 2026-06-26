// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // @nuxt/ui (v3) já traz Tailwind CSS, @nuxt/icon (marcas via Iconify),
  // @nuxt/fonts e color-mode integrados — cobre o que a seção 2 pede.
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],

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

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
