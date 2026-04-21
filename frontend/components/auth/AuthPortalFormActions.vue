<script setup lang="ts">
import AuthPortalSecondaryButton from '~/components/auth/AuthPortalSecondaryButton.vue'
import AuthPortalSubmitButton from '~/components/auth/AuthPortalSubmitButton.vue'

defineProps<{
  loading: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <div class="flex gap-3">
    <AuthPortalSecondaryButton flex @click="emit('back')">
      <slot name="back">Back</slot>
    </AuthPortalSecondaryButton>
    <AuthPortalSubmitButton :loading="loading" :disabled="disabled" ui-class="flex-1">
      <slot />
    </AuthPortalSubmitButton>
  </div>
</template>
