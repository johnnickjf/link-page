<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const auth = useAuthStore()
const { logout } = useAuth()
const route = useRoute()

const nav = [
  { label: 'Dashboard', to: '/admin', icon: 'i-lucide-layout-dashboard' },
  { label: 'Usuários', to: '/admin/users', icon: 'i-lucide-users' },
]

function isActive(to: string): boolean {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

const menuItems = computed<DropdownMenuItem[][]>(() => [
  [{ label: auth.user?.email || '', type: 'label' }],
  [{ label: 'Sair', icon: 'i-lucide-log-out', onSelect: logout }],
])
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Admin Header -->
    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-7xl items-center gap-4 px-5 py-0">
        <!-- Logo + badge admin -->
        <NuxtLink to="/admin" class="flex items-center gap-2 py-3 text-sm font-bold tracking-tight shrink-0">
          <div class="flex size-7 items-center justify-center rounded-md bg-primary-600 text-white">
            <UIcon name="i-lucide-shield" class="size-4" />
          </div>
          <span class="hidden sm:inline">LinkLand</span>
          <UBadge color="primary" variant="subtle" size="sm" class="hidden sm:inline-flex">Admin</UBadge>
        </NuxtLink>

        <!-- Nav -->
        <nav class="flex flex-1 items-stretch gap-0.5">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-1.5 border-b-2 px-3 py-3.5 text-sm transition"
            :class="isActive(item.to)
              ? 'border-primary-600 font-semibold text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'"
          >
            <UIcon :name="item.icon" class="size-4 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Ações direita -->
        <div class="flex items-center gap-2">
          <UTooltip text="Voltar ao app">
            <UButton
              to="/dashboard"
              icon="i-lucide-arrow-left"
              size="sm"
              variant="ghost"
              color="neutral"
            >
              <span class="hidden sm:inline">Minha área</span>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="menuItems">
            <UButton color="neutral" variant="ghost" size="sm" trailing-icon="i-lucide-chevron-down">
              <UAvatar icon="i-lucide-user" size="2xs" />
              <span class="hidden md:inline">{{ auth.user?.name || 'Admin' }}</span>
            </UButton>
          </UDropdownMenu>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="mx-auto max-w-7xl px-5 py-6 sm:py-8">
      <slot />
    </main>
  </div>
</template>
