<script setup lang="ts">
const gradId = useId()
</script>

<template>
  <a
    href="/"
    class="mt-12 flex flex-col items-center gap-1.5 text-center text-xs opacity-80 transition-opacity hover:opacity-100"
    style="color: var(--lp-text)"
    aria-label="Criado com LinkLand — crie sua conta gratuitamente"
  >
    <div class="flex items-center gap-1.5">
      <span aria-hidden="true">Criado por</span>
      <svg class="size-3.5 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#6366f1" />
            <stop offset="50%" stop-color="#8b5cf6" />
            <stop offset="100%" stop-color="#d946ef" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" :fill="`url(#${gradId})`" />
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
      <span class="font-semibold" aria-hidden="true">LinkLand</span>
    </div>
    <span class="text-[11px]" style="color: var(--lp-accent)" aria-hidden="true">
      Crie sua conta gratuitamente →
    </span>
  </a>
</template>
