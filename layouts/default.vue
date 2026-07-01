<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

// Layout do app logado: header com marca + menu do usuário.
const auth = useAuthStore()
const { logout } = useAuth()

const menuItems = computed<DropdownMenuItem[][]>(() => [
  [{ label: auth.user?.email || 'Minha conta', type: 'label' }],
  [
    { label: 'Minha conta', icon: 'i-lucide-user', to: '/account' },
    { label: 'Planos', icon: 'i-lucide-sparkles', to: '/settings' },
  ],
  [
    {
      label: 'Sair',
      icon: 'i-lucide-log-out',
      onSelect: () => {
        logout()
      },
    },
  ],
])
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
  >
    <header
      class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="mx-auto flex max-w-5xl items-center justify-between px-5 py-3"
      >
        <Logo to="/dashboard" />

        <div class="flex items-center gap-2">
          <UButton
            v-if="auth.isSuperadmin"
            to="/admin"
            icon="i-lucide-shield"
            size="sm"
            variant="ghost"
            color="neutral"
          >
            <span class="hidden sm:inline">Admin</span>
          </UButton>

          <UButton
            v-if="auth.user?.plan === 'free'"
            to="/settings"
            size="sm"
            icon="i-lucide-sparkles"
            class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
          >
            <span class="hidden sm:inline">Premium</span>
          </UButton>

          <UDropdownMenu :items="menuItems">
            <UButton
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-chevron-down"
            >
              <UAvatar icon="i-lucide-user" size="2xs" />
              <span class="hidden sm:inline">{{ auth.user?.name || 'Conta' }}</span>
            </UButton>
          </UDropdownMenu>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-5 py-5 sm:py-8">
      <slot />
    </main>

    <footer class="border-t border-gray-100 py-4 dark:border-gray-800">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 text-xs text-gray-400 dark:text-gray-500">
        <span>© {{ new Date().getFullYear() }} LinkLand</span>
        <div class="flex gap-4">
          <NuxtLink to="/termos" class="hover:text-gray-600 dark:hover:text-gray-300">Termos de Uso</NuxtLink>
          <NuxtLink to="/privacidade" class="hover:text-gray-600 dark:hover:text-gray-300">Privacidade</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
