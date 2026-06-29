<script setup lang="ts">
// Cabeçalho da página: avatar (upload), título, bio. Os v-models alimentam o
// preview ao vivo; "Salvar" persiste via PUT /page/{id}.
const title = defineModel<string>('title', { required: true })
const bio = defineModel<string>('bio', { default: '' })
const avatarUrl = defineModel<string>('avatarUrl', { default: '' })

const props = defineProps<{ saving?: boolean; pageId: string }>()
const emit = defineEmits<{ save: [] }>()

const store = usePagesStore()
// Avatar usa o endpoint dedicado POST /page/{id}/avatar.
const uploadAvatar = (file: File) => store.uploadAvatar(props.pageId, file)
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-display font-semibold">Cabeçalho</h2>
    </template>

    <div class="space-y-4">
      <ImageUploadField
        v-model="avatarUrl"
        :uploader="uploadAvatar"
        rounded="full"
        :button-label="avatarUrl ? 'Trocar foto' : 'Enviar foto'"
      />

      <UFormField label="Título">
        <UInput v-model="title" placeholder="Seu nome ou marca" class="w-full" />
      </UFormField>

      <UFormField label="Bio" :hint="`${(bio || '').length}/500`">
        <UTextarea
          v-model="bio"
          :rows="3"
          :maxlength="500"
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
