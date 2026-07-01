<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { Page } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Minhas páginas · LinkLand' })

const auth = useAuthStore()
const { fetchMe } = useAuth()
const pagesStore = usePagesStore()
const toast = useToast()
const { copy } = useClipboard()
const origin = useRequestURL().origin
const route = useRoute()

const userLoading = ref(false)

// ---- Onboarding ----
const ONBOARDING_KEY = 'll_onboarding_done'
const showOnboarding = ref(false)

function dismissOnboarding(): void {
  showOnboarding.value = false
  if (import.meta.client) localStorage.setItem(ONBOARDING_KEY, '1')
}

function checkOnboarding(): void {
  if (!import.meta.client) return
  const done = localStorage.getItem(ONBOARDING_KEY)
  if (!done && pagesStore.pages.length === 0) {
    showOnboarding.value = true
  }
}

watch(() => pagesStore.loaded, (loaded) => {
  if (loaded) checkOnboarding()
}, { immediate: true })

onMounted(async () => {
  const payment = route.query.payment as string | undefined
  if (payment) {
    // Remove o query param da URL sem recarregar a página.
    await navigateTo('/dashboard', { replace: true })
  }

  userLoading.value = true
  try {
    await fetchMe()
  } catch {
    // 401 já é tratado pelo useApi (refresh/logout).
  } finally {
    userLoading.value = false
  }

  if (payment === 'success') {
    toast.add({
      title: 'Pagamento confirmado!',
      description: 'Seu plano Premium está ativo. Aproveite todos os recursos.',
      color: 'success',
      duration: 8000,
    })
  } else if (payment === 'cancelled') {
    toast.add({
      title: 'Checkout cancelado',
      description: 'Nenhum valor foi cobrado. Volte quando quiser assinar.',
      color: 'neutral',
      duration: 5000,
    })
  }

  if (!pagesStore.loaded) await pagesStore.fetchPages()
})

// ---- Upgrade CTA ----
const isFree = computed(() => auth.user?.plan === 'free')

// ---- Seu plano (GET /user/me) ----
const planLabel = computed(() => {
  switch (auth.user?.plan) {
    case 'free':
      return 'Free'
    case 'premium':
      return 'Premium'
    case 'custom':
      return 'Personalizado'
    default:
      return '—'
  }
})
const maxPages = computed(() => auth.user?.limits?.max_pages ?? null)
const usedPages = computed(() => pagesStore.pages.length)
const pluralPages = (n: number) => (n === 1 ? 'página' : 'páginas')
const usageText = computed(() =>
  maxPages.value === null
    ? `${usedPages.value} ${pluralPages(usedPages.value)} · sem limite`
    : `${usedPages.value} de ${maxPages.value} ${pluralPages(maxPages.value)}`,
)

// ---- Link público / copiar ----
function publicUrl(slug: string): string {
  return `${origin}/${slug}`
}
async function copyLink(slug: string): Promise<void> {
  await copy(publicUrl(slug))
  toast.add({ title: 'Link copiado!', color: 'success' })
}

// ---- Nova página ----
const createOpen = ref(false)
const creating = ref(false)
const createError = ref<string | null>(null)
const form = reactive({ title: '', slug: '' })
let lastAuto = ''

watch(
  () => form.title,
  (title) => {
    // Sincroniza slug com o título enquanto o usuário não editar o slug à mão.
    if (form.slug === lastAuto) {
      lastAuto = slugify(title)
      form.slug = lastAuto
    }
  },
)
watch(createOpen, (open) => {
  if (open) {
    form.title = ''
    form.slug = ''
    lastAuto = ''
    createError.value = null
  }
})

function validateCreate(state: typeof form): FormError[] {
  const errors: FormError[] = []
  if (!state.title.trim()) {
    errors.push({ name: 'title', message: 'Informe um título' })
  }
  if (!state.slug) {
    errors.push({ name: 'slug', message: 'Informe um endereço (slug)' })
  } else if (!isValidSlugFormat(state.slug)) {
    errors.push({
      name: 'slug',
      message: 'Use 3–40 caracteres: minúsculas, números e hífen',
    })
  }
  return errors
}

async function onCreate(_e: FormSubmitEvent<typeof form>): Promise<void> {
  creating.value = true
  createError.value = null
  try {
    const page = await pagesStore.createPage({
      slug: form.slug,
      title: form.title.trim(),
    })
    toast.add({ title: 'Página criada!', color: 'success' })
    createOpen.value = false
    await navigateTo(`/editor/${page.id}`)
  } catch (err) {
    // 403 (limite do plano) / 409 (slug em uso) / 422 (slug inválido).
    createError.value = getApiErrorMessage(err)
  } finally {
    creating.value = false
  }
}

// ---- Excluir ----
const pageToDelete = ref<Page | null>(null)
const deleting = ref(false)
async function confirmDelete(): Promise<void> {
  if (!pageToDelete.value) return
  deleting.value = true
  try {
    await pagesStore.deletePage(pageToDelete.value.id)
    toast.add({ title: 'Página excluída', color: 'success' })
    pageToDelete.value = null
  } catch (err) {
    toast.add({
      title: 'Não foi possível excluir',
      description: getApiErrorMessage(err),
      color: 'error',
    })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <OnboardingModal
      v-if="showOnboarding"
      @done="dismissOnboarding"
    />
    <div class="flex items-center justify-between gap-4">
      <h1 class="font-display text-2xl font-bold tracking-tight">Minhas páginas</h1>
      <UButton icon="i-lucide-plus" @click="createOpen = true">Nova página</UButton>
    </div>

    <!-- CTA Premium (só para Free) -->
    <div
      v-if="isFree && !userLoading"
      class="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 px-6 py-5 shadow-lg"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white"
          >
            <UIcon name="i-lucide-sparkles" class="size-5" />
          </div>
          <div>
            <p class="font-semibold text-white">Desbloqueie o LinkLand Premium</p>
            <p class="mt-1 text-sm text-white/75">
              Templates exclusivos, fontes, QR Code, blocos de texto e imagem — tudo por
              <strong class="text-white">R$19,90/mês</strong>.
            </p>
          </div>
        </div>
        <NuxtLink
          to="/settings"
          class="shrink-0 self-start rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-white/90 sm:self-auto"
        >
          Ver planos →
        </NuxtLink>
      </div>
    </div>

    <!-- Seu plano -->
    <UCard class="mt-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="min-w-0">
          <p class="text-sm text-gray-500 dark:text-gray-400">Seu plano</p>
          <USkeleton v-if="userLoading && !auth.user" class="mt-1 h-6 w-40" />
          <template v-else>
            <p class="text-lg font-semibold">Plano {{ planLabel }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ usageText }}</p>
          </template>
        </div>
        <div v-if="maxPages !== null" class="w-full sm:w-56">
          <UProgress
            :model-value="usedPages"
            :max="maxPages"
            :color="usedPages >= maxPages ? 'error' : usedPages / maxPages >= 0.8 ? 'warning' : undefined"
          />
        </div>
      </div>
    </UCard>

    <!-- Loading -->
    <div
      v-if="!pagesStore.loaded && !pagesStore.error"
      class="mt-6 grid gap-4 sm:grid-cols-2"
    >
      <USkeleton v-for="i in 4" :key="i" class="h-32 w-full rounded-xl" />
    </div>

    <!-- Erro -->
    <div v-else-if="pagesStore.error" class="mt-6">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Erro ao carregar suas páginas"
        :description="pagesStore.error"
      />
      <UButton
        class="mt-3"
        variant="subtle"
        color="neutral"
        icon="i-lucide-refresh-cw"
        @click="pagesStore.fetchPages()"
      >
        Tentar novamente
      </UButton>
    </div>

    <!-- Vazio -->
    <div
      v-else-if="pagesStore.pages.length === 0"
      class="mt-6 rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700"
    >
      <div
        class="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
      >
        <UIcon name="i-lucide-link" class="size-6" />
      </div>
      <h3 class="mt-4 font-semibold">Você ainda não tem páginas</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Crie sua primeira página de links em segundos.
      </p>
      <UButton class="mt-5" icon="i-lucide-plus" @click="createOpen = true">
        Criar primeira página
      </UButton>
    </div>

    <!-- Lista -->
    <div v-else class="mt-6 grid gap-4 sm:grid-cols-2">
      <div
        v-for="page in pagesStore.pages"
        :key="page.id"
        class="flex flex-col rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="truncate font-semibold">{{ page.title }}</h3>
            <button
              type="button"
              class="mt-0.5 flex max-w-full items-center gap-1 rounded text-sm text-gray-500 transition hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              @click="copyLink(page.slug)"
            >
              <span class="truncate">/{{ page.slug }}</span>
              <UIcon name="i-lucide-copy" class="size-3.5 shrink-0" />
            </button>
          </div>
          <UBadge
            :color="page.is_published ? 'success' : 'neutral'"
            variant="subtle"
          >
            {{ page.is_published ? 'Publicado' : 'Rascunho' }}
          </UBadge>
        </div>

        <div class="mt-4 flex items-center gap-2">
          <UButton :to="`/editor/${page.id}`" icon="i-lucide-pencil" size="sm">
            Editar
          </UButton>
          <UButton
            v-if="page.is_published"
            :href="publicUrl(page.slug)"
            target="_blank"
            icon="i-lucide-external-link"
            size="sm"
            variant="ghost"
            color="neutral"
          >
            Ver
          </UButton>
          <UButton
            v-else
            :to="`/preview/${page.id}`"
            target="_blank"
            icon="i-lucide-eye"
            size="sm"
            variant="ghost"
            color="neutral"
          >
            Prévia
          </UButton>
          <UButton
            class="ml-auto"
            icon="i-lucide-trash-2"
            size="sm"
            variant="ghost"
            color="error"
            aria-label="Excluir página"
            @click="pageToDelete = page"
          />
        </div>
      </div>
    </div>

    <!-- Modal: nova página -->
    <UModal v-model:open="createOpen" title="Nova página">
      <template #body>
        <UForm
          :state="form"
          :validate="validateCreate"
          class="space-y-4"
          @submit="onCreate"
        >
          <UAlert
            v-if="createError"
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            :description="createError"
          />
          <UFormField label="Título" name="title">
            <UInput v-model="form.title" placeholder="Minha página" class="w-full" />
          </UFormField>
          <UFormField
            label="Endereço público"
            name="slug"
            :hint="`${origin}/${form.slug || 'seu-slug'}`"
          >
            <UInput v-model="form.slug" placeholder="seu-slug" class="w-full" />
          </UFormField>
          <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <UButton color="neutral" variant="ghost" class="w-full sm:w-auto" @click="createOpen = false">
              Cancelar
            </UButton>
            <UButton type="submit" :loading="creating" class="w-full sm:w-auto">Criar página</UButton>
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Modal: excluir -->
    <UModal
      :open="!!pageToDelete"
      title="Excluir página"
      @update:open="(v: boolean) => { if (!v) pageToDelete = null }"
    >
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Tem certeza que deseja excluir
          <strong>{{ pageToDelete?.title }}</strong>? Essa ação não pode ser
          desfeita.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton color="neutral" variant="ghost" class="w-full sm:w-auto" @click="pageToDelete = null">
            Cancelar
          </UButton>
          <UButton color="error" :loading="deleting" class="w-full sm:w-auto" @click="confirmDelete">
            Excluir
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
