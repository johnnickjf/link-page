import { defineStore } from 'pinia'
import type { AuthToken, User } from '~/types/api'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

/**
 * Estado de autenticação. O token (JWT) fica em cookie (`useCookie`) para
 * funcionar em SSR e no middleware; o usuário fica no estado da store.
 * O backend não usa refresh token — o refresh renova o token logado via Bearer.
 */
export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>('ll_token', {
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    default: () => null,
  })

  const user = ref<User | null>(null)

  const token = computed(() => tokenCookie.value)
  const isAuthenticated = computed(() => Boolean(tokenCookie.value))
  const isSuperadmin = computed(() => Boolean(user.value?.is_superadmin))

  function setToken(data: AuthToken): void {
    tokenCookie.value = data.access_token
  }

  function setUser(value: User | null): void {
    user.value = value
  }

  function clear(): void {
    tokenCookie.value = null
    user.value = null
  }

  return { user, token, isAuthenticated, isSuperadmin, setToken, setUser, clear }
})
