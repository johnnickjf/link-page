import type {
  AuthToken,
  ForgotPasswordPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from '~/types/api'

/**
 * Fluxos de autenticação (seção 4). As telas (login/registro/reset) entram na
 * Fase 2 e consomem estes métodos.
 */
export function useAuth() {
  const auth = useAuthStore()
  const { request } = useApi()

  /** `POST /auth/token` é form-urlencoded (`username`+`password`), não JSON. */
  async function login(email: string, password: string): Promise<User> {
    const body = new URLSearchParams()
    body.set('username', email)
    body.set('password', password)
    const token = await request<AuthToken>('/auth/token', { method: 'POST', body })
    auth.setToken(token)
    return fetchMe()
  }

  async function register(payload: RegisterPayload): Promise<void> {
    await request('/auth/register', { method: 'POST', body: payload })
  }

  async function fetchMe(): Promise<User> {
    const me = await request<User>('/user/me')
    auth.setUser(me)
    return me
  }

  async function logout(): Promise<void> {
    auth.clear()
    await navigateTo('/login')
  }

  function verifyEmail(payload: VerifyEmailPayload): Promise<unknown> {
    return request('/auth/verify-email', { method: 'POST', body: payload })
  }

  function resendVerification(
    payload: ResendVerificationPayload,
  ): Promise<unknown> {
    return request('/auth/resend-verification', { method: 'POST', body: payload })
  }

  function forgotPassword(payload: ForgotPasswordPayload): Promise<unknown> {
    return request('/auth/forgot-password', { method: 'POST', body: payload })
  }

  function resetPassword(payload: ResetPasswordPayload): Promise<unknown> {
    return request('/auth/reset-password', { method: 'POST', body: payload })
  }

  return {
    user: computed(() => auth.user),
    isAuthenticated: computed(() => auth.isAuthenticated),
    login,
    register,
    fetchMe,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  }
}
