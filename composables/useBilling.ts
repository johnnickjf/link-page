export function useBilling() {
  const { request } = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function checkout(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await request<{ url: string }>('/billing/checkout', { method: 'POST' })
      window.location.href = data.url
    } catch (e) {
      error.value = getApiErrorMessage(e)
    } finally {
      loading.value = false
    }
  }

  async function portal(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await request<{ url: string }>('/billing/portal', { method: 'POST' })
      window.location.href = data.url
    } catch (e) {
      error.value = getApiErrorMessage(e)
    } finally {
      loading.value = false
    }
  }

  return { checkout, portal, loading, error }
}
