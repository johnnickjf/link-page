<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<{ done: [] }>()

const pagesStore = usePagesStore()
const auth = useAuthStore()
const toast = useToast()
const origin = useRequestURL().origin

const step = ref(1)
const TOTAL_STEPS = 5

// Página criada no passo 2
const createdPageId = ref<string | null>(null)
const createdPageSlug = ref<string | null>(null)

// Passo 2: formulário de criação
const form = reactive({ title: '', slug: '' })
let lastAuto = ''
const creating = ref(false)
const createError = ref<string | null>(null)

watch(
  () => form.title,
  (title) => {
    if (form.slug === lastAuto) {
      lastAuto = slugify(title)
      form.slug = lastAuto
    }
  },
)

function validateCreate(s: typeof form): FormError[] {
  const errors: FormError[] = []
  if (!s.title.trim()) errors.push({ name: 'title', message: 'Informe um título' })
  if (!s.slug) {
    errors.push({ name: 'slug', message: 'Informe um endereço' })
  } else if (!isValidSlugFormat(s.slug)) {
    errors.push({ name: 'slug', message: 'Use 3–40 caracteres: minúsculas, números e hífen' })
  }
  return errors
}

async function onCreate(e: FormSubmitEvent<typeof form>): Promise<void> {
  creating.value = true
  createError.value = null
  try {
    const page = await pagesStore.createPage({
      slug: e.data.slug,
      title: e.data.title.trim(),
    })
    createdPageId.value = page.id
    createdPageSlug.value = page.slug
    step.value = 3
  } catch (err) {
    createError.value = getApiErrorMessage(err)
  } finally {
    creating.value = false
  }
}

// Passo 3/4/5: navegar para o editor
async function goToEditor(): Promise<void> {
  const id = createdPageId.value
  if (!id) return
  // Salva o localStorage antes de navegar para garantir que o onboarding não volte
  emit('done')
  await navigateTo(`/editor/${id}`)
}

// Passo 5: copiar link compartilhável
const { copy } = useClipboard()
async function copyLink(): Promise<void> {
  if (!createdPageSlug.value) return
  await copy(`${origin}/${createdPageSlug.value}`)
  toast.add({ title: 'Link copiado!', color: 'success' })
}

const stepMeta = [
  { icon: 'i-lucide-party-popper', title: 'Boas-vindas' },
  { icon: 'i-lucide-file-plus', title: 'Criar página' },
  { icon: 'i-lucide-blocks', title: 'Adicionar blocos' },
  { icon: 'i-lucide-globe', title: 'Publicar' },
  { icon: 'i-lucide-share-2', title: 'Compartilhar' },
]

const currentMeta = computed(() => stepMeta[step.value - 1]!)
</script>

<template>
  <UModal
    :open="true"
    :dismissible="false"
    :ui="{ content: 'sm:max-w-lg' }"
  >
    <template #header>
      <div class="w-full space-y-3 pr-2">
        <!-- Progresso -->
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ step }} / {{ TOTAL_STEPS }}
          </span>
          <button
            type="button"
            class="text-xs text-gray-400 underline-offset-2 hover:text-gray-600 hover:underline dark:hover:text-gray-300"
            @click="emit('done')"
          >
            Pular tutorial
          </button>
        </div>
        <div class="flex gap-1">
          <div
            v-for="(_, i) in stepMeta"
            :key="i"
            class="h-1 flex-1 rounded-full transition-all duration-300"
            :class="i < step ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'"
          />
        </div>
        <div class="flex items-center gap-2">
          <UIcon :name="currentMeta.icon" class="size-5 shrink-0 text-primary-500" />
          <span class="font-semibold">{{ currentMeta.title }}</span>
        </div>
      </div>
    </template>

    <template #body>
      <!-- ── Passo 1: Boas-vindas ── -->
      <div v-if="step === 1" class="space-y-5">
        <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950/60">
            <UIcon name="i-lucide-party-popper" class="size-7 text-primary-500" />
          </div>
          <div>
            <h2 class="text-lg font-bold">
              Bem-vindo{{ auth.user?.name ? `, ${auth.user.name.split(' ')[0]}` : '' }}! 🎉
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Você está a poucos passos de ter sua página de links pronta. Vamos começar?
            </p>
          </div>
        </div>

        <ul class="divide-y divide-gray-100 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
          <li
            v-for="(s, i) in stepMeta"
            :key="i"
            class="flex items-center gap-3 px-4 py-3 text-sm"
          >
            <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/40">
              <UIcon :name="s.icon" class="size-4 text-primary-500" />
            </div>
            <span class="text-gray-700 dark:text-gray-300">{{ s.title }}</span>
          </li>
        </ul>
      </div>

      <!-- ── Passo 2: Criar página ── -->
      <div v-else-if="step === 2" class="space-y-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Escolha um nome e um endereço único para sua primeira página de links.
        </p>
        <UForm :state="form" :validate="validateCreate" class="space-y-3" @submit="onCreate">
          <UAlert
            v-if="createError"
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            :description="createError"
          />
          <UFormField label="Nome da página" name="title">
            <UInput
              v-model="form.title"
              placeholder="Minha página"
              class="w-full"
              autofocus
            />
          </UFormField>
          <UFormField
            label="Endereço público"
            name="slug"
            :hint="`${origin}/${form.slug || 'meu-endereco'}`"
          >
            <UInput v-model="form.slug" placeholder="meu-endereco" class="w-full" />
          </UFormField>
          <!-- O botão de submit fica dentro do form para funcionar corretamente -->
          <UButton
            type="submit"
            block
            :loading="creating"
            icon="i-lucide-plus"
            class="mt-2"
          >
            Criar minha página
          </UButton>
        </UForm>
      </div>

      <!-- ── Passo 3: Adicionar blocos (guia) ── -->
      <div v-else-if="step === 3" class="space-y-4">
        <div class="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/40">
          <UIcon name="i-lucide-check-circle" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
          <div>
            <p class="font-semibold text-green-800 dark:text-green-200">Página criada com sucesso!</p>
            <p class="mt-0.5 text-sm text-green-700 dark:text-green-300">
              Agora vamos adicionar conteúdo à sua página.
            </p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          <strong>Blocos</strong> são os elementos da sua página. Clique em <strong>+ Adicionar</strong> no editor para criar:
        </p>
        <ul class="space-y-2">
          <li v-for="item in [
            { icon: 'i-lucide-link', label: 'Link', desc: 'Qualquer URL com título personalizado' },
            { icon: 'i-lucide-at-sign', label: 'Social', desc: 'Instagram, TikTok, YouTube e mais' },
            { icon: 'i-simple-icons-whatsapp', label: 'WhatsApp', desc: 'Botão de contato direto' },
          ]" :key="item.label" class="flex items-center gap-3 text-sm">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/40">
              <UIcon :name="item.icon" class="size-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span>
              <strong class="text-gray-800 dark:text-gray-200">{{ item.label }}</strong>
              <span class="text-gray-500 dark:text-gray-400"> — {{ item.desc }}</span>
            </span>
          </li>
        </ul>
      </div>

      <!-- ── Passo 4: Publicar (guia) ── -->
      <div v-else-if="step === 4" class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Quando terminar de adicionar blocos, publique sua página para torná-la visível ao público.
        </p>
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
          <p class="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            No editor, use o toggle no topo:
          </p>
          <div class="flex items-center gap-3 text-sm">
            <div class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-gray-900">
              <div class="h-4 w-7 rounded-full bg-gray-200 dark:bg-gray-600" />
              <span class="text-gray-400">Rascunho</span>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0 text-gray-400" />
            <div class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm ring-2 ring-primary-500 dark:bg-gray-900">
              <div class="h-4 w-7 rounded-full bg-primary-500" />
              <span class="font-semibold text-primary-600 dark:text-primary-400">Publicado</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Passo 5: Compartilhar ── -->
      <div v-else-if="step === 5" class="space-y-4">
        <div class="flex flex-col items-center gap-3 py-2 text-center">
          <div class="flex size-14 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950/60">
            <UIcon name="i-lucide-rocket" class="size-7 text-green-600" />
          </div>
          <div>
            <h2 class="text-lg font-bold">Tudo pronto! 🚀</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Depois de publicar, compartilhe o link da sua página em qualquer lugar.
            </p>
          </div>
        </div>

        <div
          v-if="createdPageSlug"
          class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-link" class="size-4 shrink-0 text-gray-400" />
          <span class="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            {{ origin }}/{{ createdPageSlug }}
          </span>
          <button
            type="button"
            class="shrink-0 text-gray-400 hover:text-primary-500"
            aria-label="Copiar link"
            @click="copyLink"
          >
            <UIcon name="i-lucide-copy" class="size-4" />
          </button>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center gap-2">
        <!-- Voltar (passos 3, 4, 5 podem voltar; mas passo 3 volta pra 2 não faz sentido após criar) -->
        <UButton
          v-if="step === 4 || step === 5"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          @click="step--"
        >
          Voltar
        </UButton>

        <div class="flex-1" />

        <!-- Passo 1 -->
        <UButton v-if="step === 1" @click="step = 2">
          Começar
          <template #trailing>
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </template>
        </UButton>

        <!-- Passo 2: sem botão na footer — o submit fica dentro do UForm no body -->

        <!-- Passo 3 -->
        <UButton v-else-if="step === 3" @click="step = 4">
          Próximo
          <template #trailing>
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </template>
        </UButton>

        <!-- Passo 4 -->
        <UButton v-else-if="step === 4" @click="step = 5">
          Próximo
          <template #trailing>
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </template>
        </UButton>

        <!-- Passo 5 -->
        <template v-else-if="step === 5">
          <UButton variant="ghost" color="neutral" @click="emit('done')">
            Fechar
          </UButton>
          <UButton icon="i-lucide-pencil" color="primary" @click="goToEditor">
            Abrir editor
          </UButton>
        </template>
      </div>
    </template>
  </UModal>
</template>
