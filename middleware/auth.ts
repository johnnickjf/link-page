// Protege rotas do app. Aplicado por página via
// `definePageMeta({ middleware: 'auth' })` a partir da Fase 2.
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
