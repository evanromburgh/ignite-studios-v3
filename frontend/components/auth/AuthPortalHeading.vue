<script setup lang="ts">
import { authPortalSubtitleClass, authPortalTitleClass } from '~/utils/authPortalClasses'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="text-center">
    <h2 :class="authPortalTitleClass">{{ title }}</h2>
    <p v-if="subtitle" :class="authPortalSubtitleClass">{{ subtitle }}</p>
  </div>
</template>
