<script setup lang="ts">
// Cabeçalho da página: avatar (URL), título, bio. Os v-models são os mesmos
// refs que alimentam o preview ao vivo; "Salvar" persiste via PUT /page/{id}.
const title = defineModel<string>('title', { required: true })
const bio = defineModel<string>('bio', { default: '' })
const avatarUrl = defineModel<string>('avatarUrl', { default: '' })

defineProps<{ saving?: boolean }>()
const emit = defineEmits<{ save: [] }>()
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold">Cabeçalho</h2>
    </template>

    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="Avatar"
          class="size-16 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
        />
        <div
          v-else
          class="flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-user" class="size-7" />
        </div>
        <UFormField label="URL do avatar" class="flex-1">
          <UInput
            v-model="avatarUrl"
            placeholder="https://…/foto.jpg"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField label="Título">
        <UInput v-model="title" placeholder="Seu nome ou marca" class="w-full" />
      </UFormField>

      <UFormField label="Bio">
        <UTextarea
          v-model="bio"
          :rows="3"
          placeholder="Uma descrição curta…"
          class="w-full"
        />
      </UFormField>

      <div class="flex justify-end">
        <UButton :loading="saving" icon="i-lucide-save" @click="emit('save')">
          Salvar
        </UButton>
      </div>
    </div>
  </UCard>
</template>
