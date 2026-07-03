import type { Plan, SupportStatus, SupportType } from '~/types/api'

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

export const supportTypeLabel: Record<SupportType, string> = {
  support: 'Suporte',
  question: 'Dúvida',
  suggestion: 'Sugestão',
  bug_report: 'Relatar problema',
  billing: 'Financeiro',
  other: 'Outro',
}

export const supportStatusLabel: Record<SupportStatus, string> = {
  open: 'Aberta',
  answered: 'Respondida',
  closed: 'Fechada',
}

export const supportStatusBadgeColor: Record<
  SupportStatus,
  'warning' | 'success' | 'neutral'
> = {
  open: 'warning',
  answered: 'success',
  closed: 'neutral',
}

export function formatDate(iso?: string, monthFormat: 'short' | 'long' = 'short'): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: monthFormat,
    year: 'numeric',
  })
}
