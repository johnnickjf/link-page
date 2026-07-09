/**
 * Diretiva `v-reveal`: fade+slide sutil quando o elemento entra na viewport.
 *
 * - Universal (registrada tambem no SSR como no-op, senao o render server
 *   falha com "Failed to resolve directive").
 * - Zero dependências (IntersectionObserver nativo) e um único observer
 *   compartilhado por todos os elementos.
 * - SSR-safe: o conteúdo é renderizado visível no HTML (SEO/no-JS ok); a
 *   classe `.reveal` só é aplicada no mounted, já no client.
 * - Respeita `prefers-reduced-motion` (revela tudo sem animar).
 * - `v-reveal="120"` adiciona 120ms de delay (efeito cascata em grids).
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', {
      getSSRProps() {
        return {}
      },
    })
    return
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let observer: IntersectionObserver | null = null
  if (!reduced && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (!observer) {
        el.classList.add('reveal-in')
        return
      }
      el.classList.add('reveal')
      if (typeof binding.value === 'number' && binding.value > 0) {
        el.style.transitionDelay = `${binding.value}ms`
      }
      observer.observe(el)
    },
    getSSRProps() {
      return {}
    },
  })
})
