import type { CreateSupportPayload, SupportRequestConfirmation } from '~/types/api'

/** Fluxo de suporte do usuário comum (POST /support). */
export function useSupport() {
  const { request } = useApi()

  function createRequest(
    payload: CreateSupportPayload,
  ): Promise<SupportRequestConfirmation> {
    return request<SupportRequestConfirmation>('/support', {
      method: 'POST',
      body: payload,
    })
  }

  return { createRequest }
}
