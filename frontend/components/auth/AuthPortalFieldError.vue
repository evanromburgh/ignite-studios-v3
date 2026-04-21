<script setup lang="ts">
import { authPortalErrorClass } from '~/utils/authPortalClasses'

defineProps<{
  message: string | null
  padded?: boolean
}>()
</script>

<template>
  <div v-if="message" :class="[authPortalErrorClass, padded && 'py-2']">{{ message }}</div>
</template>
