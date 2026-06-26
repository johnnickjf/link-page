<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

// Layout do app logado: header com marca + menu do usuário.
const auth = useAuthStore()
const { logout } = useAuth()

const menuItems = computed<DropdownMenuItem[][]>(() => [
  [{ label: auth.user?.email || 'Minha conta', type: 'label' }],
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
    class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
  >
    <header
      class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="mx-auto flex max-w-5xl items-center justify-between px-5 py-3"
      >
        <NuxtLink to="/dashboard" class="font-semibold tracking-tight">
          Link<span class="text-primary-500">Land</span>
        </NuxtLink>

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
    </header>

    <main class="mx-auto max-w-5xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
