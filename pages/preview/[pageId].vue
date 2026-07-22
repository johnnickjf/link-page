<script setup lang="ts">
import type { Block, ID, Page, PageTab, PublicBlock, Theme } from '~/types/api'

definePageMeta({ middleware: 'auth', layout: 'public' })

const route = useRoute()
const store = usePagesStore()
const pageId = computed(() => String(route.params.pageId))

const page = ref<Page | null>(null)
const blocks = ref<Block[]>([])
const tabs = ref<PageTab[]>([])
const activeTabId = ref<ID | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const [p, blks, tbs] = await Promise.all([
      store.getPage(pageId.value),
      store.fetchBlocks(pageId.value),
      store.fetchTabs(pageId.value),
    ])
    page.value = p
    blocks.value = [...blks]
    tabs.value = [...tbs]
    activeTabId.value = tabs.value[0]?.id ?? null
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
})

useHead(() => ({
  title: page.value ? `Pré-visualização: ${page.value.title} · LinkLand` : 'Pré-visualização · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
}))

// Seções: toggle só com 2+; sem seções, mostra os blocos soltos (tab_id null).
const hasTabs = computed(() => tabs.value.length >= 2)
const publicTabs = computed(() =>
  tabs.value.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    blocks: [] as PublicBlock[],
  })),
)
const previewBlocks = computed<PublicBlock[]>(() =>
  blocks.value
    .filter((b) => b.tab_id === activeTabId.value && b.is_active)
    .sort((a, b) => a.position - b.position),
)
</script>

<template>
  <div>
    <!-- Banner fixo de preview -->
    <div
      class="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-amber-900 dark:border-amber-700 dark:bg-amber-950/90 dark:text-amber-200"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <UIcon name="i-lucide-eye" class="size-4 shrink-0" />
        <span class="hidden sm:inline">Pré-visualização — esta página ainda não está publicada.</span>
        <span class="sm:hidden">Pré-visualização</span>
      </div>
      <UButton
        :to="`/editor/${pageId}`"
        size="xs"
        variant="subtle"
        color="neutral"
        icon="i-lucide-arrow-left"
      >
        <span class="hidden sm:inline">Voltar ao editor</span>
        <span class="sm:hidden">Editor</span>
      </UButton>
    </div>

    <!-- Conteúdo com offset do banner -->
    <div class="pt-10">
      <div v-if="loading" class="flex min-h-screen items-center justify-center">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-gray-400" />
      </div>

      <div v-else-if="error" class="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <UAlert
          color="error"
          variant="soft"
          icon="i-lucide-triangle-alert"
          title="Não foi possível carregar a pré-visualização"
          :description="error"
        />
        <UButton :to="`/editor/${pageId}`" variant="ghost" color="neutral" icon="i-lucide-arrow-left">
          Voltar ao editor
        </UButton>
      </div>

      <TemplateRenderer
        v-else-if="page"
        :template="page.template"
        :title="page.title"
        :bio="page.bio"
        :avatar-url="page.avatar_url"
        :theme="(page.theme as Theme)"
        :blocks="previewBlocks"
      >
        <template v-if="hasTabs" #tabs>
          <PageTabsToggle
            :model-value="activeTabId ?? ''"
            :tabs="publicTabs"
            @update:model-value="(id: string) => (activeTabId = id)"
          />
        </template>
      </TemplateRenderer>
    </div>
  </div>
</template>
