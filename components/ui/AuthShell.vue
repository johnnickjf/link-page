<script setup lang="ts">
// Card centralizado compartilhado pelas telas de auth.
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
  >
    <NuxtLink to="/" class="text-xl font-semibold tracking-tight">
      Link<span class="text-primary-500">Land</span>
    </NuxtLink>

    <UCard class="w-full max-w-sm">
      <div class="space-y-1 mb-5">
        <h1 class="text-lg font-semibold">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </div>

      <slot />

      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>
    </UCard>
  </div>
</template>
