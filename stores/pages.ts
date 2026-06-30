import { defineStore } from 'pinia'
import type {
  Block,
  CreateBlockPayload,
  CreatePagePayload,
  ID,
  Page,
  Template,
  UpdateBlockPayload,
  UpdatePagePayload,
} from '~/types/api'

/**
 * Páginas + blocos do usuário. A lista (`pages`) é fonte única compartilhada
 * entre dashboard e editor. Erros de negócio (403/409/422) são propagados pelas
 * actions de escrita para a tela exibir a mensagem da API.
 */
export const usePagesStore = defineStore('pages', () => {
  const pages = ref<Page[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const templates = ref<Template[]>([])
  const templatesLoaded = ref(false)

  function upsert(page: Page): void {
    const i = pages.value.findIndex((p) => p.id === page.id)
    if (i >= 0) pages.value[i] = page
  }

  // -------- Templates (cache de sessão) --------
  async function fetchTemplates(): Promise<Template[]> {
    if (templatesLoaded.value) return templates.value
    const { request } = useApi()
    templates.value = await request<Template[]>('/template')
    templatesLoaded.value = true
    return templates.value
  }

  // -------- Páginas --------
  async function fetchPages(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { request } = useApi()
      pages.value = await request<Page[]>('/page')
      loaded.value = true
    } catch (e) {
      error.value = getApiErrorMessage(e)
    } finally {
      loading.value = false
    }
  }

  async function getPage(id: ID): Promise<Page> {
    const { request } = useApi()
    const page = await request<Page>(`/page/${id}`)
    upsert(page)
    return page
  }

  async function createPage(payload: CreatePagePayload): Promise<Page> {
    const { request } = useApi()
    const page = await request<Page>('/page', { method: 'POST', body: payload })
    pages.value = [page, ...pages.value]
    return page
  }

  async function updatePage(id: ID, payload: UpdatePagePayload): Promise<Page> {
    const { request } = useApi()
    const page = await request<Page>(`/page/${id}`, { method: 'PUT', body: payload })
    upsert(page)
    return page
  }

  async function publishPage(id: ID, is_published: boolean): Promise<Page> {
    const { request } = useApi()
    const page = await request<Page>(`/page/${id}/publish`, {
      method: 'PATCH',
      body: { is_published },
    })
    upsert(page)
    return page
  }

  async function deletePage(id: ID): Promise<void> {
    const { request } = useApi()
    await request(`/page/${id}`, { method: 'DELETE' })
    pages.value = pages.value.filter((p) => p.id !== id)
  }

  /** Upload do avatar (multipart). O back converte/valida e devolve a URL final. */
  async function uploadAvatar(pageId: ID, file: File): Promise<string> {
    const { request } = useApi()
    const form = new FormData()
    form.append('file', file)
    const res = await request<{ avatar_url: string }>(
      `/page/${pageId}/avatar`,
      { method: 'POST', body: form },
    )
    return res.avatar_url
  }

  // -------- Blocos --------
  async function fetchBlocks(pageId: ID): Promise<Block[]> {
    const { request } = useApi()
    return request<Block[]>(`/page/${pageId}/block`)
  }

  async function createBlock(
    pageId: ID,
    payload: CreateBlockPayload,
  ): Promise<Block> {
    const { request } = useApi()
    return request<Block>(`/page/${pageId}/block`, {
      method: 'POST',
      body: payload,
    })
  }

  async function updateBlock(
    blockId: ID,
    payload: UpdateBlockPayload,
  ): Promise<Block> {
    const { request } = useApi()
    return request<Block>(`/block/${blockId}`, { method: 'PUT', body: payload })
  }

  async function deleteBlock(blockId: ID): Promise<void> {
    const { request } = useApi()
    await request(`/block/${blockId}`, { method: 'DELETE' })
  }

  async function reorderBlocks(pageId: ID, order: ID[]): Promise<void> {
    const { request } = useApi()
    await request('/block/reorder', {
      method: 'PATCH',
      body: { page_id: pageId, order },
    })
  }

  return {
    pages,
    loading,
    error,
    loaded,
    templates,
    templatesLoaded,
    fetchTemplates,
    fetchPages,
    getPage,
    createPage,
    updatePage,
    publishPage,
    deletePage,
    uploadAvatar,
    fetchBlocks,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
  }
})
