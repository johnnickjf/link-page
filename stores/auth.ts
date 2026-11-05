import { defineStore } from 'pinia'
import type { AuthToken, CustomFeatures, User } from '~/types/api'

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

  /** true se o usuário tem acesso premium completo (superadmin, Premium ou Gamer). */
  const isPremium = computed(() =>
    Boolean(
      user.value?.is_superadmin
      || user.value?.plan === 'premium'
      || user.value?.plan === 'gamer',
    ),
  )

  /**
   * Verifica uma feature pela lista resolvida pelo back (`features`). Quem
   * decide o que cada plano libera é o catálogo do backend; o front só consulta.
   * O caminho sem `features` cobre um back ainda sem o campo durante o deploy.
   */
  function hasFeature(feature: string): boolean {
    if (!user.value) return false
    if (user.value.features) return user.value.features.includes(feature)
    if (isPremium.value) return true
    const cf = user.value.plan === 'custom' ? user.value.custom_features : null
    if (!cf) return false
    if (feature.startsWith('block:')) return cf.block_types?.includes(feature.slice(6)) ?? false
    if (feature.startsWith('template:')) return cf.templates?.includes(feature.slice(9)) ?? false
    return Boolean(cf[feature as keyof CustomFeatures])
  }

  function canUseFeature(flag: keyof CustomFeatures): boolean {
    return hasFeature(flag)
  }

  /** Verifica se o usuário pode usar um tipo de bloco (ex.: 'text', 'image'). */
  function canUseBlockType(type: string): boolean {
    return hasFeature(`block:${type}`)
  }

  /** Verifica se o usuário pode usar um template (ex.: 'gradient', 'neon'). */
  function canUseTemplate(id: string): boolean {
    return hasFeature(`template:${id}`)
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
    hasFeature,
    canUseFeature,
    canUseBlockType,
    canUseTemplate,
  }
})
