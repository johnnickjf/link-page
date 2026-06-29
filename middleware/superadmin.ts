// Protege o painel /admin: exige login + is_superadmin.
// Aplicado via definePageMeta({ middleware: 'superadmin' }).
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) return navigateTo('/login')

  // Garante o usuário carregado (para ler is_superadmin do GET /user/me).
  if (!auth.user) {
    try {
      await useAuth().fetchMe()
    } catch {
      return navigateTo('/login')
    }
  }

  if (!auth.isSuperadmin) return navigateTo('/dashboard')
})
