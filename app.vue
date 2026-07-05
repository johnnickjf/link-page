<script setup lang="ts">
// Captura ?referral_code=X em qualquer página (não só a home) e guarda no
// localStorage — cobre tanto quem entra direto em /register?referral_code=X
// quanto quem navega pela home antes de se cadastrar.
const route = useRoute()
const { capture } = useReferralCode()

watch(() => route.query.referral_code, () => capture(route.query), { immediate: true })
</script>

<template>
  <!-- UApp provê os providers de toast/overlay/tooltip do Nuxt UI. -->
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
