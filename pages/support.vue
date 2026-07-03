<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { SupportType } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({
  title: 'Suporte · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const auth = useAuthStore()
const { createRequest } = useSupport()
const toast = useToast()

const MESSAGE_MAX = 1000

const TYPES: { value: SupportType; label: string }[] = [
  { value: 'support', label: 'Suporte' },
  { value: 'question', label: 'Dúvida' },
  { value: 'suggestion', label: 'Sugestão' },
  { value: 'bug_report', label: 'Relatar problema' },
  { value: 'billing', label: 'Financeiro' },
  { value: 'other', label: 'Outro' },
]

const state = reactive({
  type: 'support' as SupportType,
  email: auth.user?.email ?? '',
  message: '',
})
const submitting = ref(false)
const submitted = ref(false)

function validate(s: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!s.email) {
    errors.push({ name: 'email', message: 'Informe um e-mail' })
  } else if (!isValidEmail(s.email)) {
    errors.push({ name: 'email', message: 'E-mail inválido' })
  }
  if (!s.message.trim()) errors.push({ name: 'message', message: 'Escreva sua mensagem' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>): Promise<void> {
  submitting.value = true
  try {
    await createRequest(event.data)
    submitted.value = true
  } catch (e) {
    toast.add({
      title: 'Não foi possível enviar',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  } finally {
    submitting.value = false
  }
}

function sendAnother(): void {
  submitted.value = false
  state.type = 'support'
  state.message = ''
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div class="flex items-center gap-3">
      <UButton to="/dashboard" icon="i-lucide-arrow-left" variant="ghost" color="neutral" size="sm" />
      <h1 class="font-display text-2xl font-bold tracking-tight">Suporte</h1>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-life-buoy" class="size-5 text-gray-500" />
          <h2 class="font-display font-semibold">Fale com a gente</h2>
        </div>
      </template>

      <!-- Confirmação -->
      <div v-if="submitted" class="space-y-4">
        <UAlert
          icon="i-lucide-circle-check"
          color="success"
          variant="soft"
          title="Solicitação enviada com sucesso!"
          description="Nossa equipe analisará sua mensagem e responderá o mais breve possível através do e-mail informado."
        />
        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <UButton variant="subtle" color="neutral" @click="sendAnother">
            Enviar outra solicitação
          </UButton>
          <UButton to="/dashboard">Voltar ao dashboard</UButton>
        </div>
      </div>

      <!-- Formulário -->
      <UForm v-else :state="state" :validate="validate" class="space-y-4" @submit="onSubmit">
        <UFormField label="Tipo da solicitação" name="type">
          <USelect v-model="state.type" :items="TYPES" class="w-full" />
        </UFormField>

        <UFormField
          label="E-mail para resposta"
          name="email"
          hint="Pode ser diferente do e-mail da sua conta"
        >
          <UInput v-model="state.email" type="email" placeholder="voce@email.com" class="w-full" />
        </UFormField>

        <UFormField
          label="Mensagem"
          name="message"
          :hint="`${state.message.length}/${MESSAGE_MAX}`"
        >
          <UTextarea
            v-model="state.message"
            :rows="6"
            :maxlength="MESSAGE_MAX"
            placeholder="Conte com detalhes o que você precisa…"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" icon="i-lucide-send" :loading="submitting">
            Enviar solicitação
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
