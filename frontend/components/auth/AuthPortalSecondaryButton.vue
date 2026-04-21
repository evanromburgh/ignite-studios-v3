<script setup lang="ts">
import { authPortalSecondaryButtonClass } from '~/utils/authPortalClasses'

defineProps<{
  /** Use in flex rows (Back + primary). */
  flex?: boolean
}>()
</script>

<template>
  <button
    type="button"
    :class="[authPortalSecondaryButtonClass, flex ? 'flex-1' : 'w-full']"
  >
    <slot />
  </button>
</template>
