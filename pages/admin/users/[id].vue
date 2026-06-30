<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { AdminUser, CustomFeatures, Plan, UpdatePlanPayload } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'superadmin' })

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
const PREMIUM_BLOCK_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'image', label: 'Imagem' },
]

const PREMIUM_TEMPLATES = [
  { value: 'gradient', label: 'Gradient' },
  { value: 'neon', label: 'Neon' },
]

const planForm = reactive({ plan: 'free' as Plan, max_pages: null as number | null, max_blocks_per_page: null as number | null })
const customFeatures = reactive<CustomFeatures>({
  max_pages: null,
  max_blocks_per_page: null,
  block_types: [],
  templates: [],
  custom_background: false,
  custom_font: false,
  hide_branding: false,
  qr_code: false,
})
const savingPlan = ref(false)

function syncPlanForm(u: AdminUser): void {
  planForm.plan = u.plan
  planForm.max_pages = u.max_pages ?? null
  planForm.max_blocks_per_page = u.max_blocks_per_page ?? null
  if (u.custom_features) {
    customFeatures.max_pages = u.custom_features.max_pages ?? null
    customFeatures.max_blocks_per_page = u.custom_features.max_blocks_per_page ?? null
    customFeatures.block_types = [...(u.custom_features.block_types ?? [])]
    customFeatures.templates = [...(u.custom_features.templates ?? [])]
    customFeatures.custom_background = u.custom_features.custom_background ?? false
    customFeatures.custom_font = u.custom_features.custom_font ?? false
    customFeatures.hide_branding = u.custom_features.hide_branding ?? false
    customFeatures.qr_code = u.custom_features.qr_code ?? false
  } else {
    customFeatures.max_pages = null
    customFeatures.max_blocks_per_page = null
    customFeatures.block_types = []
    customFeatures.templates = []
    customFeatures.custom_background = false
    customFeatures.custom_font = false
    customFeatures.hide_branding = false
    customFeatures.qr_code = false
  }
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

function toggleBlockType(type: string): void {
  const idx = customFeatures.block_types.indexOf(type)
  if (idx === -1) customFeatures.block_types.push(type)
  else customFeatures.block_types.splice(idx, 1)
}

function toggleTemplate(id: string): void {
  const idx = customFeatures.templates.indexOf(id)
  if (idx === -1) customFeatures.templates.push(id)
  else customFeatures.templates.splice(idx, 1)
}

async function savePlan(): Promise<void> {
  savingPlan.value = true
  try {
    const payload: UpdatePlanPayload =
      planForm.plan === 'custom'
        ? { plan: 'custom', custom_features: { ...customFeatures } }
        : { plan: planForm.plan, max_pages: planForm.max_pages ?? undefined, max_blocks_per_page: planForm.max_blocks_per_page ?? undefined }
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
    toast.add({ title: value ? 'Conta ativada' : 'Conta desativada', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Erro', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    savingStatus.value = false
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

// ---- Convite Premium ----
const inviting = ref(false)
async function sendInvite(): Promise<void> {
  inviting.value = true
  try {
    await admin.sendPremiumInvite(id.value)
    toast.add({ title: 'Convite enviado com sucesso', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Erro ao enviar convite', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    inviting.value = false
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
    toast.add({ title: 'Não foi possível excluir', description: getApiErrorMessage(e), color: 'error' })
  } finally {
    deleting.value = false
  }
}

</script>

<template>
  <div>
    <!-- Breadcrumb / volta -->
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <NuxtLink to="/admin/users" class="hover:text-primary-500">Usuários</NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="size-3.5" />
      <span class="text-gray-900 dark:text-gray-100">{{ user?.name || '…' }}</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-5 space-y-4">
      <USkeleton class="h-28 w-full rounded-xl" />
      <div class="grid gap-4 lg:grid-cols-2">
        <USkeleton v-for="i in 4" :key="i" class="h-40 w-full rounded-xl" />
      </div>
    </div>

    <!-- Erro -->
    <div v-else-if="error || !user" class="mt-5">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Não foi possível carregar o usuário"
        :description="error || 'Usuário não encontrado.'"
      >
        <template #actions>
          <UButton size="sm" @click="load">Tentar novamente</UButton>
          <UButton to="/admin/users" size="sm" variant="ghost" color="neutral">Voltar</UButton>
        </template>
      </UAlert>
    </div>

    <template v-else>
      <!-- Cabeçalho do usuário -->
      <div class="mt-5 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-4">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="font-display text-xl font-bold">{{ user.name }}</h1>
              <UBadge v-if="user.is_superadmin" color="primary" variant="subtle">admin</UBadge>
              <UBadge :color="planBadgeColor[user.plan]" variant="subtle">
                {{ planLabel[user.plan] }}
              </UBadge>
              <UBadge :color="user.is_active ? 'success' : 'error'" variant="subtle">
                {{ user.is_active ? 'Ativo' : 'Inativo' }}
              </UBadge>
              <UBadge :color="user.email_verified ? 'success' : 'warning'" variant="subtle">
                {{ user.email_verified ? 'E-mail verificado' : 'E-mail pendente' }}
              </UBadge>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
            <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <span>Desde {{ formatDate(user.created_at, 'long') }}</span>
              <span v-if="user.referral_code" class="flex items-center gap-1">
                <UIcon name="i-lucide-tag" class="size-3" />
                Indicação: <span class="font-mono font-medium">{{ user.referral_code }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Ações rápidas -->
        <div class="flex flex-wrap gap-2">
          <UButton
            v-if="user.plan === 'free'"
            size="sm"
            variant="subtle"
            color="primary"
            icon="i-lucide-sparkles"
            :loading="inviting"
            @click="sendInvite"
          >
            Convidar Premium
          </UButton>
          <UButton
            size="sm"
            variant="subtle"
            :color="user.is_active ? 'error' : 'success'"
            :icon="user.is_active ? 'i-lucide-user-x' : 'i-lucide-user-check'"
            :loading="savingStatus"
            @click="toggleStatus(!user.is_active)"
          >
            {{ user.is_active ? 'Desativar' : 'Ativar' }}
          </UButton>
          <UButton
            v-if="!user.email_verified"
            size="sm"
            variant="subtle"
            color="neutral"
            icon="i-lucide-mail-check"
            :loading="verifying"
            @click="forceVerify"
          >
            Verificar e-mail
          </UButton>
          <UButton
            v-if="!user.is_superadmin"
            size="sm"
            variant="subtle"
            color="error"
            icon="i-lucide-trash-2"
            @click="deleteOpen = true"
          >
            Excluir
          </UButton>
        </div>
      </div>

      <!-- Grid de cards -->
      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <!-- Plano -->
        <UCard :class="planForm.plan === 'custom' ? 'lg:col-span-2' : ''">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-sparkles" class="size-4 text-amber-500" />
              <h3 class="font-display font-semibold">Plano</h3>
            </div>
          </template>
          <div class="space-y-5">
            <!-- Seletor de plano -->
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

            <!-- Free / Premium: override de limites opcional -->
            <template v-if="planForm.plan !== 'custom'">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                <template v-if="planForm.plan === 'free'">Padrão: 1 página · 10 blocos por página.</template>
                <template v-else>Padrão: 10 páginas · 100 blocos por página.</template>
              </p>
              <div class="grid grid-cols-2 gap-3">
                <UFormField label="Máx. páginas (override)">
                  <UInput v-model.number="planForm.max_pages" type="number" min="1" placeholder="Padrão do plano" class="w-full" />
                </UFormField>
                <UFormField label="Máx. blocos/página (override)">
                  <UInput v-model.number="planForm.max_blocks_per_page" type="number" min="1" placeholder="Padrão do plano" class="w-full" />
                </UFormField>
              </div>
            </template>

            <!-- Custom: editor granular de features -->
            <template v-else>
              <div class="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-950/30">
                <p class="mb-4 text-xs font-medium text-primary-700 dark:text-primary-300">
                  Configure exatamente o que este usuário pode acessar. O plano personalizado não passa pelo Stripe.
                </p>

                <div class="grid gap-6 sm:grid-cols-2">
                  <!-- Limites de quantidade -->
                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Limites</p>
                    <div class="space-y-3">
                      <UFormField label="Máx. páginas (null = ilimitado)">
                        <UInput v-model.number="customFeatures.max_pages" type="number" min="1" placeholder="Ilimitado" class="w-full" />
                      </UFormField>
                      <UFormField label="Máx. blocos/página (null = ilimitado)">
                        <UInput v-model.number="customFeatures.max_blocks_per_page" type="number" min="1" placeholder="Ilimitado" class="w-full" />
                      </UFormField>
                    </div>
                  </div>

                  <!-- Tipos de bloco premium -->
                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Blocos premium</p>
                    <div class="space-y-2">
                      <label
                        v-for="bt in PREMIUM_BLOCK_TYPES"
                        :key="bt.value"
                        class="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <UCheckbox
                          :model-value="customFeatures.block_types.includes(bt.value)"
                          @update:model-value="toggleBlockType(bt.value)"
                        />
                        {{ bt.label }}
                      </label>
                    </div>

                    <p class="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Templates premium</p>
                    <div class="space-y-2">
                      <label
                        v-for="tpl in PREMIUM_TEMPLATES"
                        :key="tpl.value"
                        class="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <UCheckbox
                          :model-value="customFeatures.templates.includes(tpl.value)"
                          @update:model-value="toggleTemplate(tpl.value)"
                        />
                        {{ tpl.label }}
                      </label>
                    </div>
                  </div>

                  <!-- Personalização -->
                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Personalização</p>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-sm">Fundo personalizado</span>
                        <USwitch v-model="customFeatures.custom_background" />
                      </div>
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-sm">Fonte personalizada</span>
                        <USwitch v-model="customFeatures.custom_font" />
                      </div>
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-sm">Ocultar branding</span>
                        <USwitch v-model="customFeatures.hide_branding" />
                      </div>
                    </div>
                  </div>

                  <!-- Extras -->
                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Extras</p>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-sm">QR Code</span>
                        <USwitch v-model="customFeatures.qr_code" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class="flex justify-end">
              <UButton :loading="savingPlan" icon="i-lucide-save" size="sm" @click="savePlan">
                Salvar plano
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Redefinir senha -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-key-round" class="size-4 text-gray-500" />
              <h3 class="font-display font-semibold">Redefinir senha</h3>
            </div>
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
              <UButton type="submit" size="sm" :loading="savingPw" color="neutral">
                Redefinir senha
              </UButton>
            </div>
          </UForm>
        </UCard>

        <!-- Status e verificação -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-shield-check" class="size-4 text-gray-500" />
              <h3 class="font-display font-semibold">Acesso</h3>
            </div>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium">Conta ativa</p>
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

            <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-medium">Verificação de e-mail</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ user.email_verified ? 'E-mail já verificado.' : 'Liberar acesso manualmente.' }}
                  </p>
                </div>
                <UBadge v-if="user.email_verified" color="success" variant="subtle" icon="i-lucide-circle-check">
                  Verificado
                </UBadge>
                <UButton
                  v-else
                  size="sm"
                  variant="subtle"
                  color="neutral"
                  :loading="verifying"
                  icon="i-lucide-mail-check"
                  @click="forceVerify"
                >
                  Forçar verificação
                </UButton>
              </div>
            </div>

            <div v-if="user.plan === 'free'" class="border-t border-gray-100 pt-4 dark:border-gray-800">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-medium">Convite Premium</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Envia um e-mail convidando a assinar.
                  </p>
                </div>
                <UButton
                  size="sm"
                  variant="subtle"
                  color="primary"
                  icon="i-lucide-sparkles"
                  :loading="inviting"
                  @click="sendInvite"
                >
                  Enviar convite
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Zona de perigo -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-triangle-alert" class="size-4 text-error" />
              <h3 class="font-display font-semibold text-error">Zona de perigo</h3>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Remove o usuário e, em cascata, todas as suas páginas e blocos. Ação <strong>irreversível</strong>.
          </p>
          <p v-if="user.is_superadmin" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
              Excluir usuário
            </UButton>
          </div>
        </UCard>
      </div>
    </template>

    <!-- Modal excluir -->
    <UModal v-model:open="deleteOpen" title="Excluir usuário">
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Tem certeza que deseja excluir <strong>{{ user?.name }}</strong>?
          As páginas e blocos dele também serão removidos. Essa ação não pode ser desfeita.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton color="neutral" variant="ghost" class="w-full sm:w-auto" @click="deleteOpen = false">
            Cancelar
          </UButton>
          <UButton color="error" :loading="deleting" class="w-full sm:w-auto" @click="confirmDelete">
            Sim, excluir
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
