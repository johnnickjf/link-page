<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ middleware: 'auth' })
useHead({
  title: 'Minha conta · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const auth = useAuthStore()
const { updateProfile, changePassword, deleteAccount } = useAuth()
const toast = useToast()

// ---- Perfil ----
const profileState = reactive({ name: auth.user?.name ?? '' })
const savingProfile = ref(false)

function validateProfile(s: typeof profileState): FormError[] {
  if (!s.name.trim()) return [{ name: 'name', message: 'Informe seu nome' }]
  return []
}

async function onSaveProfile(event: FormSubmitEvent<typeof profileState>): Promise<void> {
  savingProfile.value = true
  try {
    await updateProfile(event.data.name.trim())
    toast.add({ title: 'Nome atualizado!', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Erro ao atualizar', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    savingProfile.value = false
  }
}

// ---- Senha ----
const showCurrentPw = ref(false)
const showNewPw = ref(false)
const showConfirmPw = ref(false)
const passwordState = reactive({ current_password: '', new_password: '', confirm_password: '' })
const savingPassword = ref(false)

function validatePassword(s: typeof passwordState): FormError[] {
  const errors: FormError[] = []
  if (!s.current_password) errors.push({ name: 'current_password', message: 'Informe a senha atual' })
  if (!s.new_password) {
    errors.push({ name: 'new_password', message: 'Informe a nova senha' })
  } else {
    const pwErr = passwordError(s.new_password)
    if (pwErr) errors.push({ name: 'new_password', message: pwErr })
  }
  if (s.new_password && s.confirm_password && s.new_password !== s.confirm_password) {
    errors.push({ name: 'confirm_password', message: 'As senhas não coincidem' })
  }
  return errors
}

async function onChangePassword(event: FormSubmitEvent<typeof passwordState>): Promise<void> {
  savingPassword.value = true
  try {
    await changePassword({
      current_password: event.data.current_password,
      new_password: event.data.new_password,
    })
    toast.add({ title: 'Senha alterada com sucesso!', color: 'success' })
    passwordState.current_password = ''
    passwordState.new_password = ''
    passwordState.confirm_password = ''
  } catch (e) {
    toast.add({ title: 'Erro ao alterar senha', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    savingPassword.value = false
  }
}

// ---- Excluir conta ----
const deleteOpen = ref(false)
const deleteConfirmText = ref('')
const deletingAccount = ref(false)
const DELETE_PHRASE = 'excluir minha conta'
const canConfirmDelete = computed(() => deleteConfirmText.value.toLowerCase() === DELETE_PHRASE)

async function onDeleteAccount(): Promise<void> {
  if (!canConfirmDelete.value) return
  deletingAccount.value = true
  try {
    await deleteAccount()
    // deleteAccount já faz logout e redireciona para /login
  } catch (e) {
    toast.add({ title: 'Erro ao excluir conta', description: getApiErrorMessage(e), color: 'error' })
    deletingAccount.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8">
    <div class="flex items-center gap-3">
      <UButton to="/dashboard" icon="i-lucide-arrow-left" variant="ghost" color="neutral" size="sm" />
      <h1 class="font-display text-2xl font-bold tracking-tight">Minha conta</h1>
    </div>

    <!-- Perfil -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-user" class="size-5 text-gray-500" />
          <h2 class="font-display font-semibold">Perfil</h2>
        </div>
      </template>

      <UForm
        :state="profileState"
        :validate="validateProfile"
        class="space-y-4"
        @submit="onSaveProfile"
      >
        <UFormField label="Nome" name="name">
          <UInput v-model="profileState.name" placeholder="Seu nome" class="w-full" />
        </UFormField>

        <UFormField label="E-mail">
          <UInput
            :model-value="auth.user?.email ?? ''"
            type="email"
            disabled
            class="w-full"
          />
          <template #hint>
            <span class="text-xs text-gray-400">O e-mail não pode ser alterado.</span>
          </template>
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" :loading="savingProfile">Salvar</UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Alterar senha -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-lock" class="size-5 text-gray-500" />
          <h2 class="font-display font-semibold">Alterar senha</h2>
        </div>
      </template>

      <UForm
        :state="passwordState"
        :validate="validatePassword"
        class="space-y-4"
        @submit="onChangePassword"
      >
        <UFormField label="Senha atual" name="current_password">
          <UInput
            v-model="passwordState.current_password"
            :type="showCurrentPw ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full"
          >
            <template #trailing>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :aria-label="showCurrentPw ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showCurrentPw = !showCurrentPw"
              >
                <UIcon :name="showCurrentPw ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
              </button>
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Nova senha" name="new_password">
          <UInput
            v-model="passwordState.new_password"
            :type="showNewPw ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="••••••••"
            class="w-full"
          >
            <template #trailing>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :aria-label="showNewPw ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showNewPw = !showNewPw"
              >
                <UIcon :name="showNewPw ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
              </button>
            </template>
          </UInput>
          <PasswordStrengthBar :password="passwordState.new_password" class="mt-2" />
        </UFormField>

        <UFormField label="Confirmar nova senha" name="confirm_password">
          <UInput
            v-model="passwordState.confirm_password"
            :type="showConfirmPw ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="••••••••"
            class="w-full"
          >
            <template #trailing>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :aria-label="showConfirmPw ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showConfirmPw = !showConfirmPw"
              >
                <UIcon :name="showConfirmPw ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
              </button>
            </template>
          </UInput>
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" :loading="savingPassword">Alterar senha</UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Zona de perigo -->
    <UCard class="border-red-200 dark:border-red-900">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-triangle-alert" class="size-5 text-red-500" />
          <h2 class="font-display font-semibold text-red-600 dark:text-red-400">Zona de perigo</h2>
        </div>
      </template>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="font-medium">Excluir conta permanentemente</p>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Todas as suas páginas e blocos serão removidos e não poderão ser recuperados.
          </p>
        </div>
        <UButton
          color="error"
          variant="subtle"
          icon="i-lucide-trash-2"
          class="shrink-0"
          @click="deleteOpen = true"
        >
          Excluir conta
        </UButton>
      </div>
    </UCard>

    <!-- Modal de confirmação de exclusão -->
    <UModal
      v-model:open="deleteOpen"
      title="Excluir conta permanentemente"
      @update:open="(v) => { if (!v) { deleteOpen = false; deleteConfirmText = '' } }"
    >
      <template #body>
        <div class="space-y-4">
          <UAlert
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            title="Esta ação é irreversível"
            description="Todas as suas páginas, blocos e dados serão excluídos permanentemente."
          />
          <div>
            <p class="mb-2 text-sm text-gray-600 dark:text-gray-300">
              Para confirmar, digite <strong class="text-gray-900 dark:text-gray-100">{{ DELETE_PHRASE }}</strong> abaixo:
            </p>
            <UInput
              v-model="deleteConfirmText"
              :placeholder="DELETE_PHRASE"
              class="w-full"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton
            color="neutral"
            variant="ghost"
            class="w-full sm:w-auto"
            @click="deleteOpen = false; deleteConfirmText = ''"
          >
            Cancelar
          </UButton>
          <UButton
            color="error"
            :loading="deletingAccount"
            :disabled="!canConfirmDelete"
            class="w-full sm:w-auto"
            icon="i-lucide-trash-2"
            @click="onDeleteAccount"
          >
            Excluir permanentemente
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
