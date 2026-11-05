import type { PageStats, StatsSummary } from '~/types/api'

export function useStats() {
  const { request } = useApi()

  function summary(days: 7 | 30 | 90 = 30) {
    return request<StatsSummary>(`/stats/summary?days=${days}`)
  }

  function pageStats(pageId: string, days: 7 | 30 | 90 = 30) {
    return request<PageStats>(`/page/${pageId}/stats?days=${days}`)
  }

  return { summary, pageStats }
}
