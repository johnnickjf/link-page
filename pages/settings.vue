<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({
  title: 'Planos · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const auth = useAuthStore()
const billing = useBilling()

const currentPlan = computed(() => auth.user?.plan ?? 'free')
const isGamer = computed(() => currentPlan.value === 'gamer')
const isPremium = computed(() => currentPlan.value === 'premium' || isGamer.value || !!auth.user?.is_superadmin)
const isFree = computed(() => currentPlan.value === 'free')
const showManage = computed(() => currentPlan.value === 'premium' || isGamer.value)

// ---- Mensal / Anual ----
const MONTHLY_PRICE = PREMIUM_PRICE_MONTHLY
const YEARLY_PRICE = 199.9

const yearlySavingsLabel = brl(MONTHLY_PRICE * 12 - YEARLY_PRICE)
const yearlyMonthlyEquivalentLabel = brl(YEARLY_PRICE / 12)
const yearlyDiscountPct = Math.round(
  ((MONTHLY_PRICE * 12 - YEARLY_PRICE) / (MONTHLY_PRICE * 12)) * 100,
)

const interval = ref<'monthly' | 'yearly'>('monthly')
const priceLabel = computed(() => (interval.value === 'monthly' ? 'R$19,90' : 'R$199,90'))
const priceSuffix = computed(() => (interval.value === 'monthly' ? '/mês' : '/ano'))
const ctaLabel = computed(() =>
  interval.value === 'monthly' ? 'Assinar por R$19,90/mês' : 'Assinar por R$199,90/ano',
)

const gamerPriceLabel = computed(() =>
  `R$${brl(interval.value === 'monthly' ? GAMER_PRICE_MONTHLY : GAMER_PRICE_YEARLY)}`,
)
const gamerYearlySavingsLabel = brl(GAMER_PRICE_MONTHLY * 12 - GAMER_PRICE_YEARLY)
const gamerYearlyMonthlyEquivalentLabel = brl(GAMER_PRICE_YEARLY / 12)
const gamerCtaLabel = computed(() =>
  currentPlan.value === 'premium'
    ? 'Fazer upgrade para o Gamer'
    : `Assinar por ${gamerPriceLabel.value}${priceSuffix.value}`,
)

// O upgrade de quem já assina cobra a diferença na hora, sem passar pelo
// checkout do Stripe: por isso pede confirmação antes.
const confirmUpgrade = ref(false)
function chooseGamer(): void {
  if (currentPlan.value === 'premium') {
    confirmUpgrade.value = true
    return
  }
  billing.checkout(interval.value, 'gamer')
}
function runUpgrade(): void {
  confirmUpgrade.value = false
  billing.checkout(interval.value, 'gamer')
}

</script>

<template>
  <div>
    <NuxtLink
      to="/dashboard"
      class="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900 dark:hover:text-gray-100"
    >
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      Voltar
    </NuxtLink>

    <div class="mb-10 text-center">
      <h1 class="font-display text-3xl font-bold tracking-tight">Escolha seu plano</h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        Comece gratuitamente. Faça upgrade quando precisar de mais.
      </p>
    </div>

    <UAlert
      v-if="isPremium"
      class="mx-auto mb-8 max-w-3xl"
      color="success"
      variant="soft"
      icon="i-lucide-crown"
      :title="`Você já tem o plano ${isGamer ? 'Gamer' : 'Premium'}`"
      description="Aproveite os recursos do seu plano. Obrigado por apoiar o LinkLand!"
    >
      <template v-if="showManage" #actions>
        <UButton
          size="sm"
          variant="subtle"
          color="success"
          :loading="billing.loading.value"
          icon="i-lucide-credit-card"
          @click="billing.portal()"
        >
          Gerenciar assinatura
        </UButton>
      </template>
    </UAlert>

    <UAlert
      v-if="billing.error.value"
      class="mx-auto mb-6 max-w-3xl"
      color="error"
      variant="soft"
      icon="i-lucide-triangle-alert"
      :description="billing.error.value"
    />

    <!-- Mensal / Anual -->
    <div class="mx-auto mb-8 flex w-fit items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-800">
      <UButton
        size="sm"
        :variant="interval === 'monthly' ? 'solid' : 'ghost'"
        :color="interval === 'monthly' ? 'primary' : 'neutral'"
        @click="interval = 'monthly'"
      >
        Mensal
      </UButton>
      <UButton
        size="sm"
        :variant="interval === 'yearly' ? 'solid' : 'ghost'"
        :color="interval === 'yearly' ? 'primary' : 'neutral'"
        @click="interval = 'yearly'"
      >
        Anual
        <UBadge color="success" variant="subtle" size="sm" class="ml-1.5">-{{ yearlyDiscountPct }}%</UBadge>
      </UButton>
    </div>

    <div class="mx-auto grid max-w-5xl gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-0">
      <!-- Cada cartão ocupa 3 linhas da grade (subgrid): título, botão e lista ficam
           alinhados entre os planos, com a mesma altura. -->

      <!-- Free (no celular vem depois dos pagos; no desktop mantém a ordem natural) -->
      <div
        class="order-2 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:order-none lg:row-span-3 lg:grid lg:grid-rows-subgrid"
        data-testid="plan-free"
      >
        <div class="px-6 pt-6">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Free</p>
          <div class="mt-3 flex items-end gap-1">
            <span class="font-display text-4xl font-bold tracking-tight">R$0</span>
            <span class="mb-1 text-sm text-gray-500 dark:text-gray-400">/mês</span>
          </div>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Para começar a construir sua presença online.
          </p>
        </div>

        <div class="px-6 pt-6">
          <UButton
            block
            color="neutral"
            variant="outline"
            :disabled="isFree"
          >
            {{ isFree ? 'Plano atual' : 'Usar plano Free' }}
          </UButton>
        </div>

        <div class="p-6">
          <p class="text-sm font-semibold">Inclui:</p>
          <ul class="mt-3 space-y-3">
            <li v-for="f in FREE_HIGHLIGHTS" :key="f" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-400" />
              <span>{{ f }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Premium (aparece primeiro no celular, sem precisar rolar) -->
      <div
        class="order-1 flex flex-col overflow-hidden rounded-xl bg-white ring-2 ring-primary-600 dark:bg-gray-900 dark:ring-primary-400 lg:order-none lg:row-span-3 lg:grid lg:grid-rows-subgrid"
        data-testid="plan-premium"
      >
        <div class="bg-primary-50 px-6 py-6 dark:bg-primary-950/40">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-semibold text-primary-800 dark:text-primary-200">Premium</p>
            <span class="rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-primary-400 dark:text-gray-950">
              Mais popular
            </span>
          </div>
          <div class="mt-3 flex items-end gap-1">
            <span class="font-display text-4xl font-bold tracking-tight text-gray-950 dark:text-white">{{ priceLabel }}</span>
            <span class="mb-1 text-sm text-gray-700 dark:text-gray-200">{{ priceSuffix }}</span>
          </div>
          <p v-if="interval === 'yearly'" class="mt-1 text-sm text-gray-700 dark:text-gray-200">
            Equivale a R${{ yearlyMonthlyEquivalentLabel }}/mês · economize R${{ yearlySavingsLabel }} no ano
          </p>
          <p class="mt-1.5 text-sm text-gray-700 dark:text-gray-200">
            Tudo que você precisa para crescer online.
          </p>
        </div>

        <div class="px-6 pt-6">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-primary-400 dark:text-gray-950 dark:hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isPremium || billing.loading.value"
            data-testid="buy-premium"
            @click="billing.checkout(interval)"
          >
            <UIcon v-if="isPremium" name="i-lucide-check" class="size-4" />
            <UIcon v-else-if="billing.loading.value" name="i-lucide-loader-circle" class="size-4 animate-spin" />
            {{ isGamer ? 'Incluso no Gamer' : isPremium ? 'Plano atual' : ctaLabel }}
          </button>
        </div>

        <div class="p-6">
          <p class="text-sm font-semibold">Tudo do Free, e mais:</p>
          <ul class="mt-3 space-y-3">
            <li v-for="f in PREMIUM_HIGHLIGHTS" :key="f" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-400" />
              <span>{{ f }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Gamer: tudo do Premium + exclusivos -->
      <div
        class="gamer-surface stage-bg order-1 flex flex-col overflow-hidden rounded-xl lg:order-none lg:row-span-3 lg:grid lg:grid-rows-subgrid"
        data-testid="plan-gamer"
      >
        <div class="px-6 pt-6">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-semibold text-white">Gamer</p>
            <span class="rounded-full bg-(--stage-accent) px-2.5 py-0.5 text-xs font-semibold text-(--stage-accent-ink)">
              Mais completo
            </span>
          </div>
          <div class="mt-3 flex items-end gap-1">
            <span class="font-display text-4xl font-bold tracking-tight">{{ gamerPriceLabel }}</span>
            <span class="mb-1 text-sm text-white/90">{{ priceSuffix }}</span>
          </div>
          <p v-if="interval === 'yearly'" class="mt-1 text-sm text-white/95">
            Equivale a R${{ gamerYearlyMonthlyEquivalentLabel }}/mês · economize R${{ gamerYearlySavingsLabel }} no ano
          </p>
          <p class="mt-1.5 text-sm text-white/95">
            Tudo do Premium, mais o que um perfil de jogador precisa.
          </p>
        </div>

        <div class="px-6 pt-6">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 btn-accent rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isGamer || !!auth.user?.is_superadmin || billing.loading.value"
            data-testid="buy-gamer"
            @click="chooseGamer"
          >
            <UIcon v-if="isGamer" name="i-lucide-check" class="size-4" />
            <UIcon v-else-if="billing.loading.value" name="i-lucide-loader-circle" class="size-4 animate-spin" />
            {{ isGamer ? 'Plano atual' : gamerCtaLabel }}
          </button>
        </div>

        <div class="p-6">
          <p class="text-sm font-semibold text-white">Tudo do Premium, e mais:</p>
          <ul class="mt-3 space-y-3">
            <li v-for="f in GAMER_EXCLUSIVE_FEATURES" :key="f" class="flex items-start gap-3 text-sm text-white">
              <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 stage-check" />
              <span>{{ f }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Comparação completa: o Gamer é a coluna que tem tudo. -->
    <section class="mx-auto mt-16 max-w-5xl" aria-labelledby="compare-title">
      <h2 id="compare-title" class="text-center font-display text-2xl font-bold tracking-tight">
        Compare todos os recursos
      </h2>
      <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        Cada plano inclui tudo do plano anterior.
      </p>
      <PlanComparisonTable class="mt-8" sticky-class="top-14" />
    </section>

    <UModal v-model:open="confirmUpgrade" title="Trocar para o plano Gamer?">
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Sua assinatura passa para o plano Gamer agora. A diferença proporcional ao
          tempo restante é cobrada no cartão da assinatura atual, e as próximas
          renovações seguem o valor do novo plano.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton variant="ghost" color="neutral" class="w-full sm:w-auto" @click="confirmUpgrade = false">
            Agora não
          </UButton>
          <UButton class="w-full sm:w-auto" :loading="billing.loading.value" data-testid="confirm-upgrade" @click="runUpgrade">
            Confirmar upgrade
          </UButton>
        </div>
      </template>
    </UModal>

    <p class="mx-auto mt-10 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
      Cancele quando quiser, sem multa ou fidelidade.
    </p>
  </div>
</template>
