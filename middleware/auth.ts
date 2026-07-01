// Protege rotas do app. Aplicado por página via
// `definePageMeta({ middleware: 'auth' })` a partir da Fase 2.
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // Garante o usuário carregado (plano, custom_features etc.) antes de
  // qualquer página rodar sua lógica — sem isso, um SSR/F5 direto numa rota
  // protegida deixa `auth.user` nulo e as checagens de plano tratam o
  // usuário como Free até uma navegação SPA repopular a store.
  if (!auth.user) {
    try {
      await useAuth().fetchMe()
    } catch {
      auth.clear()
      return navigateTo('/login')
    }
  }
})
