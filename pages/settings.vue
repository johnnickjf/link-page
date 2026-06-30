<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Planos · LinkLand' })

const auth = useAuthStore()
const toast = useToast()

const currentPlan = computed(() => auth.user?.plan ?? 'free')
const isPremium = computed(() => currentPlan.value === 'premium' || !!auth.user?.is_superadmin)
const isFree = computed(() => currentPlan.value === 'free')

function handleUpgrade(): void {
  // TODO: integrar com Stripe ou sistema de pagamento
  toast.add({
    title: 'Em breve!',
    description: 'O checkout está sendo configurado. Entre em contato para fazer upgrade agora.',
    color: 'info',
    duration: 6000,
  })
}

const FREE_FEATURES = [
  { label: '1 página', included: true },
  { label: 'Até 10 blocos por página', included: true },
  { label: 'Templates Minimal, Classic e Dark', included: true },
  { label: 'Blocos de Link, Social, WhatsApp e E-mail', included: true },
  { label: 'Templates Gradient e Neon', included: false },
  { label: 'Blocos de Texto e Imagem', included: false },
  { label: 'Fontes personalizadas', included: false },
  { label: 'Fundo personalizado', included: false },
  { label: 'QR Code da página', included: false },
  { label: 'Ocultar branding LinkLand', included: false },
  { label: 'Novos recursos em primeira mão', included: false },
  { label: 'Suporte prioritário', included: false },
]

const PREMIUM_FEATURES = [
  { label: 'Até 10 páginas', included: true },
  { label: 'Até 100 blocos por página', included: true },
  { label: 'Todos os templates (incluindo Gradient e Neon)', included: true },
  { label: 'Todos os blocos (incluindo Texto e Imagem)', included: true },
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
      title="Você já tem o plano Premium"
      description="Aproveite todos os recursos sem limitações. Obrigado por apoiar o LinkLand!"
    />

    <div class="mx-auto grid max-w-3xl items-start gap-6 lg:grid-cols-2">

      <!-- Free -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
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

      <!-- Premium -->
      <div class="relative">
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
              <span class="font-display text-4xl font-bold tracking-tight text-white">R$19,90</span>
              <span class="mb-1 text-sm text-indigo-200">/mês</span>
            </div>
            <p class="mt-1.5 text-sm text-indigo-100">
              Tudo que você precisa para crescer online.
            </p>
          </div>

          <div class="bg-white p-6 dark:bg-gray-900">
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isPremium"
              @click="handleUpgrade"
            >
              <UIcon v-if="isPremium" name="i-lucide-check" class="size-4" />
              {{ isPremium ? 'Plano atual' : 'Assinar por R$19,90/mês' }}
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
    </div>

    <p class="mx-auto mt-10 max-w-sm text-center text-sm text-gray-400 dark:text-gray-500">
      Cancele quando quiser, sem multa ou fidelidade.
    </p>
  </div>
</template>
