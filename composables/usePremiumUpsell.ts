/**
 * Estado global (useState, SSR-safe) do modal "recurso Premium". Qualquer
 * componente pode chamar `open()` ao interceptar o clique num recurso
 * bloqueado — sem precisar repassar emits por várias camadas de pais.
 * O <PremiumUpsellModal /> é renderizado uma única vez em layouts/default.vue.
 */
export function usePremiumUpsell() {
  const isOpen = useState('premium-upsell-open', () => false)

  function open(): void {
    isOpen.value = true
  }
  function close(): void {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
