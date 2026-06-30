import type { Plan } from '~/types/api'

export const planLabel: Record<Plan, string> = {
  free: 'Free',
  premium: 'Premium',
  custom: 'Personalizado',
}

export const planBadgeColor: Record<Plan, 'neutral' | 'warning' | 'primary'> = {
  free: 'neutral',
  premium: 'warning',
  custom: 'primary',
}

export function formatDate(iso?: string, monthFormat: 'short' | 'long' = 'short'): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: monthFormat,
    year: 'numeric',
  })
}
