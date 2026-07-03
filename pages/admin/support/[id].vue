<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'superadmin' })

const route = useRoute()
const id = computed(() => String(route.params.id))
const admin = useAdminApi()
const toast = useToast()

const request = ref<Awaited<ReturnType<typeof admin.getSupportRequest>> | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

useHead(() => ({
  title: `${request.value ? supportTypeLabel[request.value.type] : 'Solicitação'} · Suporte · Admin · LinkLand`,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
}))

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    request.value = await admin.getSupportRequest(id.value)
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

// ---- Responder ----
const REPLY_MAX = 5000
const replyOpen = ref(false)
const replyMessage = ref('')
const replying = ref(false)

function openReply(): void {
  replyMessage.value = ''
  replyOpen.value = true
}

async function submitReply(): Promise<void> {
  if (!replyMessage.value.trim()) return
  replying.value = true
  try {
    request.value = await admin.replySupportRequest(id.value, { message: replyMessage.value.trim() })
    replyOpen.value = false
    toast.add({ title: 'Resposta enviada com sucesso', color: 'success' })
  } catch (e) {
    toast.add({
      title: 'Erro ao enviar resposta',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  } finally {
    replying.value = false
  }
}
</script>

<template>
  <div>
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <NuxtLink to="/admin/support" class="hover:text-primary-500">Suporte</NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="size-3.5" />
      <span class="text-gray-900 dark:text-gray-100">
        {{ request ? supportTypeLabel[request.type] : '…' }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-5 space-y-4">
      <USkeleton class="h-28 w-full rounded-xl" />
      <USkeleton class="h-52 w-full rounded-xl" />
    </div>

    <!-- Erro -->
    <div v-else-if="error || !request" class="mt-5">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Não foi possível carregar a solicitação"
        :description="error || 'Solicitação não encontrada.'"
      >
        <template #actions>
          <UButton size="sm" @click="load">Tentar novamente</UButton>
          <UButton to="/admin/support" size="sm" variant="ghost" color="neutral">Voltar</UButton>
        </template>
      </UAlert>
    </div>

    <template v-else>
      <!-- Cabeçalho -->
      <div class="mt-5 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-4">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            {{ request.user.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="font-display text-xl font-bold">{{ request.user.name }}</h1>
              <UBadge color="neutral" variant="subtle">{{ supportTypeLabel[request.type] }}</UBadge>
              <UBadge :color="supportStatusBadgeColor[request.status]" variant="subtle">
                {{ supportStatusLabel[request.status] }}
              </UBadge>
              <UBadge v-if="request.user.plan" :color="planBadgeColor[request.user.plan]" variant="subtle">
                {{ planLabel[request.user.plan] }}
              </UBadge>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ request.user.email }}</p>
            <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Cliente desde {{ formatDate(request.user.created_at ?? undefined, 'long') }}
            </p>
          </div>
        </div>

        <UButton icon="i-lucide-reply" @click="openReply">
          {{ request.status === 'answered' ? 'Responder novamente' : 'Responder' }}
        </UButton>
      </div>

      <!-- Grid de cards -->
      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <!-- Solicitação -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-message-circle-question" class="size-4 text-gray-500" />
              <h3 class="font-display font-semibold">Solicitação</h3>
            </div>
          </template>
          <div class="space-y-4 text-sm">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">E-mail para resposta</p>
              <p class="mt-0.5">{{ request.email }}</p>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Enviada em</p>
              <p class="mt-0.5">{{ formatDate(request.created_at, 'long') }}</p>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Mensagem</p>
              <p class="mt-1 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                {{ request.message }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Resposta -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-reply" class="size-4 text-gray-500" />
              <h3 class="font-display font-semibold">Resposta</h3>
            </div>
          </template>
          <div v-if="request.reply_message" class="space-y-4 text-sm">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Respondida em</p>
              <p class="mt-0.5">{{ formatDate(request.replied_at ?? undefined, 'long') }}</p>
            </div>
            <div v-if="request.replied_by">
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Respondido por</p>
              <p class="mt-0.5">{{ request.replied_by.name }}</p>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Mensagem enviada</p>
              <p class="mt-1 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                {{ request.reply_message }}
              </p>
            </div>
          </div>
          <p v-else class="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Esta solicitação ainda não foi respondida.
          </p>
        </UCard>
      </div>
    </template>

    <!-- Modal: responder -->
    <UModal v-model:open="replyOpen" title="Responder solicitação">
      <template #body>
        <div class="space-y-3">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            A resposta será enviada por e-mail para <strong>{{ request?.email }}</strong>.
          </p>
          <UTextarea
            v-model="replyMessage"
            :rows="8"
            :maxlength="REPLY_MAX"
            placeholder="Escreva sua resposta…"
            class="w-full"
          />
          <p class="text-right text-xs text-gray-400">{{ replyMessage.length }}/{{ REPLY_MAX }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton color="neutral" variant="ghost" class="w-full sm:w-auto" @click="replyOpen = false">
            Cancelar
          </UButton>
          <UButton
            :loading="replying"
            :disabled="!replyMessage.trim()"
            class="w-full sm:w-auto"
            icon="i-lucide-send"
            @click="submitReply"
          >
            Enviar resposta
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
