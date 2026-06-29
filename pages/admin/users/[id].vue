<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { AdminUser, Plan, UpdatePlanPayload } from '~/types/api'

definePageMeta({ middleware: 'superadmin' })

const route = useRoute()
const id = computed(() => String(route.params.id))
const admin = useAdminApi()
const toast = useToast()

const user = ref<AdminUser | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

useHead(() => ({ title: `${user.value?.name || 'Usuário'} · Admin · LinkLand` }))

const planChips: { value: Plan; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' },
  { value: 'custom', label: 'Personalizado' },
]

// ---- Plano ----
const planForm = reactive({ plan: 'free' as Plan, max_pages: 1, max_blocks_per_page: 10 })
const savingPlan = ref(false)
function syncPlanForm(u: AdminUser): void {
  planForm.plan = u.plan
  planForm.max_pages = u.max_pages ?? 1
  planForm.max_blocks_per_page = u.max_blocks_per_page ?? 10
}

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const u = await admin.getUser(id.value)
    user.value = u
    syncPlanForm(u)
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function savePlan(): Promise<void> {
  if (
    planForm.plan === 'custom' &&
    (!(planForm.max_pages >= 1) || !(planForm.max_blocks_per_page >= 1))
  ) {
    toast.add({
      title: 'Limites inválidos',
      description: 'No plano personalizado, informe valores de no mínimo 1.',
      color: 'error',
    })
    return
  }
  savingPlan.value = true
  try {
    const payload: UpdatePlanPayload =
      planForm.plan === 'custom'
        ? {
            plan: 'custom',
            max_pages: planForm.max_pages,
            max_blocks_per_page: planForm.max_blocks_per_page,
          }
        : { plan: planForm.plan }
    user.value = await admin.updatePlan(id.value, payload)
    syncPlanForm(user.value)
    toast.add({ title: 'Plano atualizado', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Erro ao alterar plano', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    savingPlan.value = false
  }
}

// ---- Status ----
const savingStatus = ref(false)
async function toggleStatus(value: boolean): Promise<void> {
  savingStatus.value = true
  try {
    user.value = await admin.updateStatus(id.value, value)
    toast.add({
      title: value ? 'Conta ativada' : 'Conta desativada',
      color: 'success',
    })
  } catch (e) {
    toast.add({ title: 'Erro', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    savingStatus.value = false
  }
}

// ---- Reset de senha ----
const pwState = reactive({ password: '' })
const savingPw = ref(false)
function validatePw(s: typeof pwState): FormError[] {
  const errors: FormError[] = []
  const err = passwordError(s.password)
  if (err) errors.push({ name: 'password', message: err })
  return errors
}
async function resetPw(_e: FormSubmitEvent<typeof pwState>): Promise<void> {
  savingPw.value = true
  try {
    await admin.resetPassword(id.value, pwState.password)
    pwState.password = ''
    toast.add({ title: 'Senha redefinida com sucesso', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Erro ao redefinir', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    savingPw.value = false
  }
}

// ---- Verificação de e-mail ----
const verifying = ref(false)
async function forceVerify(): Promise<void> {
  verifying.value = true
  try {
    user.value = await admin.verifyEmail(id.value)
    toast.add({ title: 'E-mail verificado', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Erro', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    verifying.value = false
  }
}

// ---- Exclusão ----
const deleteOpen = ref(false)
const deleting = ref(false)
async function confirmDelete(): Promise<void> {
  deleting.value = true
  try {
    await admin.deleteUser(id.value)
    toast.add({ title: 'Usuário excluído', color: 'success' })
    await navigateTo('/admin/users')
  } catch (e) {
    deleteOpen.value = false
    toast.add({
      title: 'Não foi possível excluir',
      description: getApiErrorMessage(e),
      color: 'error',
    })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <UButton
        to="/admin/users"
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        size="sm"
      />
      <h1 class="font-display text-2xl font-bold tracking-tight">Usuário</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-6 space-y-4">
      <USkeleton class="h-24 w-full rounded-xl" />
      <USkeleton class="h-40 w-full rounded-xl" />
    </div>

    <!-- Erro -->
    <div v-else-if="error || !user" class="mt-6">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Não foi possível carregar o usuário"
        :description="error || 'Usuário não encontrado.'"
      />
      <div class="mt-3 flex gap-2">
        <UButton variant="subtle" color="neutral" icon="i-lucide-refresh-cw" @click="load">
          Tentar novamente
        </UButton>
        <UButton to="/admin/users" variant="ghost" color="neutral">Voltar</UButton>
      </div>
    </div>

    <template v-else>
      <!-- Identidade -->
      <UCard class="mt-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="font-display text-lg font-semibold">{{ user.name }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UBadge v-if="user.is_superadmin" color="primary" variant="subtle">admin</UBadge>
            <UBadge :color="user.is_active ? 'success' : 'error'" variant="subtle">
              {{ user.is_active ? 'Ativo' : 'Inativo' }}
            </UBadge>
            <UBadge :color="user.email_verified ? 'success' : 'warning'" variant="subtle">
              {{ user.email_verified ? 'E-mail verificado' : 'E-mail pendente' }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <!-- Plano -->
        <UCard>
          <template #header>
            <h3 class="font-display font-semibold">Plano</h3>
          </template>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="c in planChips"
                :key="c.value"
                size="sm"
                :variant="planForm.plan === c.value ? 'solid' : 'subtle'"
                :color="planForm.plan === c.value ? 'primary' : 'neutral'"
                @click="planForm.plan = c.value"
              >
                {{ c.label }}
              </UButton>
            </div>

            <div v-if="planForm.plan === 'custom'" class="grid grid-cols-2 gap-3">
              <UFormField label="Máx. páginas">
                <UInput v-model.number="planForm.max_pages" type="number" min="1" class="w-full" />
              </UFormField>
              <UFormField label="Máx. blocos/página">
                <UInput
                  v-model.number="planForm.max_blocks_per_page"
                  type="number"
                  min="1"
                  class="w-full"
                />
              </UFormField>
            </div>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400">
              Limites padrão — free: 1 página / 10 blocos · premium: 10 / 100.
            </p>

            <div class="flex justify-end">
              <UButton :loading="savingPlan" icon="i-lucide-save" @click="savePlan">
                Salvar plano
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Status + verificação -->
        <UCard>
          <template #header>
            <h3 class="font-display font-semibold">Acesso</h3>
          </template>
          <div class="space-y-5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-medium">Conta ativa</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Desativar bloqueia o login imediatamente.
                </p>
              </div>
              <USwitch
                :model-value="user.is_active"
                :disabled="savingStatus"
                @update:model-value="toggleStatus"
              />
            </div>

            <div class="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="font-medium">Verificação de e-mail</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ user.email_verified ? 'E-mail já verificado.' : 'Liberar acesso manualmente.' }}
                </p>
              </div>
              <UBadge v-if="user.email_verified" color="success" variant="subtle" class="self-start sm:self-auto">
                Verificado
              </UBadge>
              <UButton
                v-else
                size="sm"
                variant="subtle"
                color="neutral"
                :loading="verifying"
                icon="i-lucide-mail-check"
                class="self-start sm:self-auto"
                @click="forceVerify"
              >
                Forçar verificação
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Reset de senha -->
        <UCard>
          <template #header>
            <h3 class="font-display font-semibold">Redefinir senha</h3>
          </template>
          <UForm :state="pwState" :validate="validatePw" class="space-y-3" @submit="resetPw">
            <UFormField
              label="Nova senha"
              name="password"
              hint="8+ caracteres, com maiúscula, minúscula e número"
            >
              <UInput
                v-model="pwState.password"
                type="password"
                autocomplete="new-password"
                placeholder="••••••••"
                class="w-full"
              />
            </UFormField>
            <div class="flex justify-end">
              <UButton type="submit" :loading="savingPw" color="neutral">
                Redefinir senha
              </UButton>
            </div>
          </UForm>
        </UCard>

        <!-- Zona de perigo -->
        <UCard>
          <template #header>
            <h3 class="font-display font-semibold text-error">Excluir usuário</h3>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Remove o usuário e, em cascata, suas páginas e blocos. Ação irreversível.
          </p>
          <p v-if="user.is_superadmin" class="mt-2 text-xs text-gray-500">
            Não é possível excluir um superadmin.
          </p>
          <div class="mt-4 flex justify-end">
            <UButton
              color="error"
              variant="subtle"
              icon="i-lucide-trash-2"
              :disabled="user.is_superadmin"
              @click="deleteOpen = true"
            >
              Excluir
            </UButton>
          </div>
        </UCard>
      </div>
    </template>

    <!-- Modal excluir -->
    <UModal v-model:open="deleteOpen" title="Excluir usuário">
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Tem certeza que deseja excluir <strong>{{ user?.name }}</strong>? As páginas
          e blocos dele também serão removidos. Essa ação não pode ser desfeita.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton color="neutral" variant="ghost" class="w-full sm:w-auto" @click="deleteOpen = false">
            Cancelar
          </UButton>
          <UButton color="error" :loading="deleting" class="w-full sm:w-auto" @click="confirmDelete">
            Excluir
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
