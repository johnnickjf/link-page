import type {
  AdminDashboard,
  AdminSupportDetail,
  AdminSupportListItem,
  AdminSupportListParams,
  AdminUser,
  AdminUserListParams,
  ID,
  MessageResponse,
  Paginated,
  ReplySupportPayload,
  UpdatePlanPayload,
} from '~/types/api'

/**
 * Wrapper das rotas de superadmin (`/system/*`). Todas exigem Bearer de um
 * usuário com `is_superadmin` (o useApi já injeta o token).
 */
export function useAdminApi() {
  const { request } = useApi()

  function getDashboard() {
    return request<AdminDashboard>('/system/dashboard')
  }

  function listUsers(params: AdminUserListParams = {}) {
    return request<Paginated<AdminUser>>('/system/users', { query: params })
  }

  function getUser(id: ID) {
    return request<AdminUser>(`/system/users/${id}`)
  }

  function updatePlan(id: ID, payload: UpdatePlanPayload) {
    return request<AdminUser>(`/system/users/${id}/plan`, {
      method: 'PATCH',
      body: payload,
    })
  }

  function updateStatus(id: ID, isActive: boolean) {
    return request<AdminUser>(`/system/users/${id}/status`, {
      method: 'PATCH',
      body: { is_active: isActive },
    })
  }

  function resetPassword(id: ID, newPassword: string) {
    return request<MessageResponse>(`/system/users/${id}/reset-password`, {
      method: 'PATCH',
      body: { new_password: newPassword },
    })
  }

  function verifyEmail(id: ID) {
    return request<AdminUser>(`/system/users/${id}/verify-email`, {
      method: 'PATCH',
    })
  }

  function deleteUser(id: ID) {
    return request<MessageResponse>(`/system/users/${id}`, { method: 'DELETE' })
  }

  function sendPremiumInvite(id: ID) {
    return request<MessageResponse>(`/system/users/${id}/invite-premium`, {
      method: 'POST',
    })
  }

  // ---- Suporte ----
  function listSupportRequests(params: AdminSupportListParams = {}) {
    return request<Paginated<AdminSupportListItem>>('/system/support', {
      query: params,
    })
  }

  function getSupportRequest(id: ID) {
    return request<AdminSupportDetail>(`/system/support/${id}`)
  }

  function replySupportRequest(id: ID, payload: ReplySupportPayload) {
    return request<AdminSupportDetail>(`/system/support/${id}/reply`, {
      method: 'POST',
      body: payload,
    })
  }

  return {
    getDashboard,
    listUsers,
    getUser,
    updatePlan,
    updateStatus,
    resetPassword,
    verifyEmail,
    deleteUser,
    sendPremiumInvite,
    listSupportRequests,
    getSupportRequest,
    replySupportRequest,
  }
}
