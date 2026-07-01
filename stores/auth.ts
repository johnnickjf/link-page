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
    // Sem isso, um segundo usuário logando na mesma aba (sem F5) herdaria
    // páginas/cache do usuário anterior, já que usePagesStore usa `loaded`
    // como cache de sessão.
    usePagesStore().reset()
  }

  /** true se o usuário tem acesso premium completo (superadmin ou plano premium). */
  const isPremium = computed(
    () => Boolean(user.value?.is_superadmin || user.value?.plan === 'premium'),
  )

  /**
   * Verifica se o usuário pode usar uma feature específica.
   * Superadmin e premium sempre têm acesso; custom verifica custom_features.
   */
  function canUseFeature(flag: keyof import('~/types/api').CustomFeatures): boolean {
    if (!user.value) return false
    if (user.value.is_superadmin || user.value.plan === 'premium') return true
    if (user.value.plan === 'custom' && user.value.custom_features) {
      const val = user.value.custom_features[flag]
      return Boolean(val)
    }
    return false
  }

  /** Verifica se o usuário pode usar um tipo de bloco premium (ex.: 'text', 'image'). */
  function canUseBlockType(type: string): boolean {
    if (!user.value) return false
    if (user.value.is_superadmin || user.value.plan === 'premium') return true
    if (user.value.plan === 'custom' && user.value.custom_features) {
      return user.value.custom_features.block_types.includes(type)
    }
    return false
  }

  /** Verifica se o usuário pode usar um template premium (ex.: 'gradient', 'neon'). */
  function canUseTemplate(id: string): boolean {
    if (!user.value) return false
    if (user.value.is_superadmin || user.value.plan === 'premium') return true
    if (user.value.plan === 'custom' && user.value.custom_features) {
      return user.value.custom_features.templates.includes(id)
    }
    return false
  }

  return {
    user,
    token,
    isAuthenticated,
    isSuperadmin,
    isPremium,
    setToken,
    setUser,
    clear,
    canUseFeature,
    canUseBlockType,
    canUseTemplate,
  }
})
