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

// SEO / Open Graph (bonito ao compartilhar em rede social).
useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.bio || undefined,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.bio || undefined,
  ogImage: () => page.value?.avatar_url || undefined,
  ogType: 'website',
  ogUrl: url.href,
  twitterCard: 'summary_large_image',
  twitterTitle: () => page.value?.title,
  twitterDescription: () => page.value?.bio || undefined,
  twitterImage: () => page.value?.avatar_url || undefined,
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
    :blocks="page.blocks"
  />
</template>
