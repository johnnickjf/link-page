<script setup lang="ts">
import type { Block, PublicBlock, Theme } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const store = usePagesStore()
const toast = useToast()
const origin = useRequestURL().origin
const pageId = computed(() => String(route.params.pageId))

// Estado editável — alimenta o preview ao vivo.
const title = ref('')
const bio = ref('')
const avatarUrl = ref('')
const template = ref('minimal')
const slug = ref('')
const published = ref(false)
const blocks = ref<Block[]>([])
const theme = ref<Theme>({})

const loading = ref(true)
const error = ref<string | null>(null)
const savingHeader = ref(false)
const savingPublish = ref(false)
const savingAppearance = ref(false)

useHead(() => ({ title: `${title.value || 'Editor'} · LinkLand` }))

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const [page, blks] = await Promise.all([
      store.getPage(pageId.value),
      store.fetchBlocks(pageId.value),
    ])
    title.value = page.title
    bio.value = page.bio ?? ''
    avatarUrl.value = page.avatar_url ?? ''
    template.value = page.template || 'minimal'
    slug.value = page.slug
    published.value = page.is_published
    theme.value = { ...(page.theme ?? {}) }
    blocks.value = [...blks].sort((a, b) => a.position - b.position)
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

const previewBlocks = computed<PublicBlock[]>(() =>
  blocks.value.filter((b) => b.is_active),
)
const publicUrl = computed(() => `${origin}/${slug.value}`)

// ---- Cabeçalho ----
async function saveHeader(): Promise<void> {
  savingHeader.value = true
  try {
    await store.updatePage(pageId.value, {
      title: title.value.trim(),
      bio: bio.value,
      avatar_url: avatarUrl.value,
    })
    toast.add({ title: 'Cabeçalho salvo', color: 'success' })
  } catch (e) {
    toast.add({
      title: 'Erro ao salvar',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  } finally {
    savingHeader.value = false
  }
}

// ---- Template (auto-save ao escolher) ----
async function saveTemplate(id: string): Promise<void> {
  try {
    await store.updatePage(pageId.value, { template: id })
    toast.add({ title: 'Template alterado', color: 'success' })
  } catch (e) {
    toast.add({
      title: 'Erro ao trocar template',
      description: getApiErrorMessage(e),
      color: 'error',
    })
    await load()
  }
}

// ---- Aparência (theme) ----
async function saveAppearance(): Promise<void> {
  savingAppearance.value = true
  try {
    await store.updatePage(pageId.value, { theme: theme.value })
    toast.add({ title: 'Aparência salva', color: 'success' })
  } catch (e) {
    toast.add({
      title: 'Erro ao salvar aparência',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  } finally {
    savingAppearance.value = false
  }
}

// ---- Publicar ----
async function togglePublish(value: boolean): Promise<void> {
  const previous = published.value
  published.value = value
  savingPublish.value = true
  try {
    await store.publishPage(pageId.value, value)
    toast.add({
      title: value ? 'Página publicada' : 'Página despublicada',
      color: 'success',
    })
  } catch (e) {
    published.value = previous
    toast.add({
      title: 'Erro ao publicar',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  } finally {
    savingPublish.value = false
  }
}

// ---- Blocos ----
const blockModalOpen = ref(false)
const editingBlock = ref<Block | null>(null)

function addBlock(): void {
  editingBlock.value = null
  blockModalOpen.value = true
}
function editBlock(block: Block): void {
  editingBlock.value = block
  blockModalOpen.value = true
}
function onBlockSaved(block: Block): void {
  const i = blocks.value.findIndex((b) => b.id === block.id)
  if (i >= 0) blocks.value[i] = block
  else blocks.value.push(block)
}

async function persistOrder(): Promise<void> {
  try {
    await store.reorderBlocks(
      pageId.value,
      blocks.value.map((b) => b.id),
    )
    blocks.value.forEach((b, i) => (b.position = i))
  } catch (e) {
    toast.add({
      title: 'Erro ao reordenar',
      description: getApiErrorMessage(e),
      color: 'error',
    })
    await load()
  }
}

async function toggleBlock(block: Block): Promise<void> {
  const next = !block.is_active
  block.is_active = next
  try {
    await store.updateBlock(block.id, { is_active: next })
  } catch (e) {
    block.is_active = !next
    toast.add({
      title: 'Erro ao atualizar',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  }
}

const blockToDelete = ref<Block | null>(null)
const deletingBlock = ref(false)
async function confirmDeleteBlock(): Promise<void> {
  const target = blockToDelete.value
  if (!target) return
  deletingBlock.value = true
  try {
    await store.deleteBlock(target.id)
    blocks.value = blocks.value.filter((b) => b.id !== target.id)
    blockToDelete.value = null
    toast.add({ title: 'Bloco excluído', color: 'success' })
  } catch (e) {
    toast.add({
      title: 'Erro ao excluir',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  } finally {
    deletingBlock.value = false
  }
}

const mobileTab = ref<'edit' | 'preview'>('edit')
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-9 w-40" />
      <div class="grid gap-6 lg:grid-cols-2">
        <USkeleton class="h-96 w-full rounded-xl" />
        <USkeleton class="mx-auto h-[640px] w-full max-w-[380px] rounded-[2rem]" />
      </div>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="mx-auto max-w-md py-16 text-center">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Não foi possível abrir a página"
        :description="error"
      />
      <div class="mt-4 flex justify-center gap-2">
        <UButton variant="subtle" color="neutral" icon="i-lucide-refresh-cw" @click="load">
          Tentar novamente
        </UButton>
        <UButton to="/dashboard" variant="ghost" color="neutral">
          Voltar ao dashboard
        </UButton>
      </div>
    </div>

    <!-- Editor -->
    <template v-else>
      <!-- Barra superior -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <UButton
          to="/dashboard"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
        >
          Voltar
        </UButton>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <USwitch
              :model-value="published"
              :disabled="savingPublish"
              @update:model-value="togglePublish"
            />
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ published ? 'Publicado' : 'Rascunho' }}
            </span>
          </div>
          <UButton
            v-if="published"
            :href="publicUrl"
            target="_blank"
            icon="i-lucide-external-link"
            size="sm"
            variant="subtle"
            color="neutral"
          >
            Ver página
          </UButton>
        </div>
      </div>

      <!-- Abas (mobile) -->
      <div class="mt-4 flex gap-2 lg:hidden">
        <UButton
          class="flex-1 justify-center"
          :variant="mobileTab === 'edit' ? 'solid' : 'subtle'"
          color="neutral"
          @click="mobileTab = 'edit'"
        >
          Editar
        </UButton>
        <UButton
          class="flex-1 justify-center"
          :variant="mobileTab === 'preview' ? 'solid' : 'subtle'"
          color="neutral"
          @click="mobileTab = 'preview'"
        >
          Visualizar
        </UButton>
      </div>

      <div class="mt-4 grid gap-6 lg:grid-cols-2">
        <!-- Edição -->
        <div
          class="space-y-6"
          :class="mobileTab !== 'edit' ? 'hidden lg:block' : ''"
        >
          <PageHeaderForm
            v-model:title="title"
            v-model:bio="bio"
            v-model:avatar-url="avatarUrl"
            :page-id="pageId"
            :saving="savingHeader"
            @save="saveHeader"
          />

          <TemplatePicker v-model="template" @change="saveTemplate" />

          <AppearanceForm
            v-model="theme"
            :saving="savingAppearance"
            @save="saveAppearance"
          />

          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="font-display font-semibold">Blocos</h2>
                <UButton icon="i-lucide-plus" size="sm" @click="addBlock">
                  Adicionar
                </UButton>
              </div>
            </template>
            <BlockList
              v-model="blocks"
              @reorder="persistOrder"
              @edit="editBlock"
              @remove="(b) => (blockToDelete = b)"
              @toggle="toggleBlock"
            />
          </UCard>
        </div>

        <!-- Preview -->
        <div :class="mobileTab !== 'preview' ? 'hidden lg:block' : ''">
          <div class="lg:sticky lg:top-6">
            <p class="mb-2 text-center text-xs text-gray-500">Pré-visualização</p>
            <div
              class="mx-auto h-[640px] w-full max-w-[380px] overflow-y-auto rounded-[2rem] border-4 border-gray-200 shadow-xl dark:border-gray-800"
            >
              <TemplateRenderer
                :template="template"
                :title="title || 'Sua página'"
                :bio="bio"
                :avatar-url="avatarUrl"
                :theme="theme"
                :blocks="previewBlocks"
                preview
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal criar/editar bloco -->
    <BlockEditorModal
      v-model:open="blockModalOpen"
      :page-id="pageId"
      :block="editingBlock"
      :next-position="blocks.length"
      @saved="onBlockSaved"
    />

    <!-- Modal excluir bloco -->
    <UModal
      :open="!!blockToDelete"
      title="Excluir bloco"
      @update:open="(v: boolean) => { if (!v) blockToDelete = null }"
    >
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Tem certeza que deseja excluir este bloco? Essa ação não pode ser
          desfeita.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="blockToDelete = null">
            Cancelar
          </UButton>
          <UButton color="error" :loading="deletingBlock" @click="confirmDeleteBlock">
            Excluir
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
