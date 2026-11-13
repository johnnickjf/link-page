<script setup lang="ts">
import type { PublicPage } from '~/types/api'

// PÁGINA PÚBLICA (SSR) — catch-all. Sem auth, leve, rápida.
definePageMeta({ layout: 'public' })

const route = useRoute()
const config = useRuntimeConfig()
const url = useRequestURL()
const slug = computed(() => String(route.params.slug))

// SSR: busca a página pública direto na API (sem token).
const { data: page, error } = await useFetch<PublicPage>(
  () => `/public/${slug.value}`,
  { baseURL: config.public.apiBase },
)

if (error.value) {
  const status = error.value.statusCode ?? 503
  throw createError({
    statusCode: status,
    message:
      status === 404 ? 'Página não encontrada' : 'Erro ao carregar a página',
    fatal: true,
  })
}
if (!page.value) {
  throw createError({
    statusCode: 404,
    message: 'Página não encontrada',
    fatal: true,
  })
}

// Seções: só há toggle com 2+. Sem seções (tabs vazio), renderiza os blocos
// planos como sempre — caminho legado intocado.
const tabs = computed(() => page.value?.tabs ?? [])
const hasTabs = computed(() => tabs.value.length >= 2)
const activeTabId = ref(tabs.value[0]?.id ?? '')
const activeBlocks = computed(() => {
  if (tabs.value.length === 0) return page.value?.blocks ?? []
  const active = tabs.value.find((t) => t.id === activeTabId.value) ?? tabs.value[0]
  return active?.blocks ?? []
})

// Contagem anônima de visitas e cliques (só no navegador, nunca no SSR).
const { trackVisit, onClick: onTrackedClick } = usePublicTracking(slug)
onMounted(trackVisit)

// SEO e compartilhamento. Sem bio, a descrição é montada com o nome e as redes;
// sem foto, a prévia usa a imagem do LinkLand em vez de ficar em branco.
const canonical = computed(() => (page.value ? publicCanonical(url.origin, page.value) : url.href))
const description = computed(() => (page.value ? publicDescription(page.value) : undefined))
const shareImage = computed(() => page.value?.avatar_url || `${url.origin}/og-image.png`)

useHead(() => ({
  link: [{ rel: 'canonical', href: canonical.value }],
  script: page.value
    ? [{ key: 'profile-jsonld', type: 'application/ld+json', innerHTML: profileJsonLd(page.value, canonical.value) }]
    : [],
}))

useSeoMeta({
  title: () => page.value?.title,
  description,
  ogTitle: () => page.value?.title,
  ogDescription: description,
  ogImage: shareImage,
  ogType: 'profile',
  ogUrl: canonical,
  ogLocale: 'pt_BR',
  // Foto de perfil é quadrada: o cartão pequeno não a corta. Sem foto, a imagem
  // do LinkLand é larga e vai no cartão grande.
  twitterCard: () => (page.value?.avatar_url ? 'summary' : 'summary_large_image'),
  twitterTitle: () => page.value?.title,
  twitterDescription: description,
  twitterImage: shareImage,
})
</script>

<template>
  <TemplateRenderer
    v-if="page"
    :template="page.template"
    :title="page.title"
    :bio="page.bio"
    :avatar-url="page.avatar_url"
    :theme="page.theme"
    :blocks="activeBlocks"
    :profile-meta="page.kind === 'gamer' ? page.profile_meta : null"
    :progress="page.progress"
    @click.capture="onTrackedClick"
  >
    <template v-if="hasTabs" #tabs>
      <PageTabsToggle v-model="activeTabId" :tabs="tabs" />
    </template>
  </TemplateRenderer>
</template>
