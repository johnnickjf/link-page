<script setup lang="ts">
// Logo da marca: símbolo (link em tile com gradiente) + wordmark "LinkLand".
withDefaults(defineProps<{ to?: string; sm?: boolean; markOnly?: boolean }>(), {
  to: '/',
  sm: false,
  markOnly: false,
})

// id único do gradiente (evita colisão quando há vários logos na página).
const gradId = useId()
</script>

<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center gap-2 font-display font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
    aria-label="LinkLand"
  >
    <svg
      :class="sm ? 'size-6' : 'size-7'"
      class="shrink-0"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="50%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" :fill="`url(#${gradId})`" />
      <g
        transform="translate(6 6) scale(0.835)"
        fill="none"
        stroke="#fff"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
    </svg>

    <span v-if="!markOnly" :class="sm ? 'text-base' : 'text-lg'">
      Link<span class="text-brand-gradient">Land</span>
    </span>
  </NuxtLink>
</template>
