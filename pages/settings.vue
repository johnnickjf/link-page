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
const MONTHLY_PRICE = 19.9
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

const FREE_FEATURES = [
  { label: '1 página', included: true },
  { label: 'Até 10 blocos por página', included: true },
  { label: 'Templates Minimal, Classic e Dark', included: true },
  { label: 'Blocos de Link, Social, WhatsApp e E-mail', included: true },
  { label: 'SEO básico', included: true },
  { label: 'IDs de jogo, até 3 jogos e tema Arcade', included: true },
  { label: 'Nível, XP e contagem de visitas e cliques', included: true },
  { label: 'Templates Gradient e Neon', included: false },
  { label: 'Blocos de Texto e Imagem', included: false },
  { label: 'Fontes personalizadas', included: false },
  { label: 'Fundo personalizado', included: false },
  { label: 'QR Code da página', included: false },
  { label: 'Ocultar branding LinkLand', included: false },
  { label: 'SEO otimizado (Open Graph, canonical, Twitter Card)', included: false },
  { label: 'Novos recursos em primeira mão', included: false },
  { label: 'Suporte prioritário', included: false },
]

const PREMIUM_FEATURES = [
  { label: 'Até 10 páginas', included: true },
  { label: 'Até 100 blocos por página', included: true },
  { label: 'Templates Gradient, Neon e Pixel, além dos gratuitos', included: true },
  { label: 'Blocos de Texto, Imagem e Mapa', included: true },
  { label: 'SEO otimizado (Open Graph, canonical, Twitter Card)', included: true },
  { label: 'Fontes Google personalizadas', included: true },
  { label: 'Fundo personalizado (cor, gradiente ou imagem)', included: true },
  { label: 'QR Code da página', included: true },
  { label: 'Ocultar "Criado por LinkLand"', included: true },
  { label: 'Novos recursos em primeira mão', included: true },
  { label: 'Suporte prioritário', included: true },
]
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
      icon="i-lucide-sparkles"
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

    <div class="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3">

      <!-- Free (no celular vem depois do Premium; no desktop mantém a ordem natural) -->
      <div class="order-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:order-none">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Free</p>
        <div class="mt-3 flex items-end gap-1">
          <span class="font-display text-4xl font-bold tracking-tight">R$0</span>
          <span class="mb-1 text-sm text-gray-500 dark:text-gray-400">/mês</span>
        </div>
        <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Para começar a construir sua presença online.
        </p>

        <UButton
          block
          class="mt-6"
          color="neutral"
          variant="outline"
          :disabled="isFree"
        >
          {{ isFree ? 'Plano atual' : 'Usar plano Free' }}
        </UButton>

        <ul class="mt-6 space-y-3">
          <li
            v-for="f in FREE_FEATURES"
            :key="f.label"
            class="flex items-start gap-3 text-sm"
          >
            <UIcon
              :name="f.included ? 'i-lucide-check' : 'i-lucide-x'"
              class="mt-0.5 size-4 shrink-0"
              :class="f.included ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'"
            />
            <span :class="f.included ? '' : 'text-gray-400 dark:text-gray-500'">
              {{ f.label }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Premium (aparece primeiro no celular, sem precisar rolar) -->
      <div class="order-1 relative lg:order-none">
        <div class="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
          <span
            class="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-1 text-xs font-semibold text-white shadow"
          >
            Mais popular
          </span>
        </div>

        <div class="overflow-hidden rounded-xl shadow-lg ring-2 ring-indigo-500/50">
          <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 py-6">
            <p class="text-sm font-semibold text-indigo-100">Premium</p>
            <div class="mt-2 flex items-end gap-1">
              <span class="font-display text-4xl font-bold tracking-tight text-white">{{ priceLabel }}</span>
              <span class="mb-1 text-sm text-indigo-200">{{ priceSuffix }}</span>
            </div>
            <p v-if="interval === 'yearly'" class="mt-1 text-sm text-indigo-100">
              Equivale a R${{ yearlyMonthlyEquivalentLabel }}/mês · economize R${{ yearlySavingsLabel }} no ano
            </p>
            <p class="mt-1.5 text-sm text-indigo-100">
              Tudo que você precisa para crescer online.
            </p>
          </div>

          <div class="bg-white p-6 dark:bg-gray-900">
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isPremium || billing.loading.value"
              data-testid="buy-premium"
              @click="billing.checkout(interval)"
            >
              <UIcon v-if="isPremium" name="i-lucide-check" class="size-4" />
              <UIcon v-else-if="billing.loading.value" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ isGamer ? 'Incluso no Gamer' : isPremium ? 'Plano atual' : ctaLabel }}
            </button>

            <ul class="mt-6 space-y-3">
              <li
                v-for="f in PREMIUM_FEATURES"
                :key="f.label"
                class="flex items-start gap-3 text-sm"
              >
                <UIcon
                  name="i-lucide-check"
                  class="mt-0.5 size-4 shrink-0 text-indigo-500"
                />
                <span>{{ f.label }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Gamer: tudo do Premium + exclusivos -->
      <div class="order-1 stage-bg overflow-hidden rounded-xl p-6 lg:order-none" data-testid="plan-gamer">
        <p class="text-sm font-semibold text-white/80">Gamer</p>
        <div class="mt-2 flex items-end gap-1">
          <span class="font-display text-4xl font-bold tracking-tight">{{ gamerPriceLabel }}</span>
          <span class="mb-1 text-sm text-white/70">{{ priceSuffix }}</span>
        </div>
        <p class="mt-1.5 text-sm text-white/75">
          Tudo do Premium, mais o que um perfil de jogador precisa.
        </p>

        <button
          type="button"
          class="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isGamer || !!auth.user?.is_superadmin || billing.loading.value"
          data-testid="buy-gamer"
          @click="chooseGamer"
        >
          <UIcon v-if="isGamer" name="i-lucide-check" class="size-4" />
          <UIcon v-else-if="billing.loading.value" name="i-lucide-loader-circle" class="size-4 animate-spin" />
          {{ isGamer ? 'Plano atual' : gamerCtaLabel }}
        </button>

        <ul class="mt-6 space-y-3">
          <li class="flex items-start gap-3 text-sm font-medium">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-emerald-400" />
            Tudo do Premium
          </li>
          <li v-for="f in GAMER_EXCLUSIVE_FEATURES" :key="f" class="flex items-start gap-3 text-sm text-white/85">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-emerald-400" />
            {{ f }}
          </li>
        </ul>
      </div>
    </div>

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

    <p class="mx-auto mt-10 max-w-sm text-center text-sm text-gray-400 dark:text-gray-500">
      Cancele quando quiser, sem multa ou fidelidade.
    </p>
  </div>
</template>
