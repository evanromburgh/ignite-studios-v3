<script setup lang="ts">
import { authPortalLabelClass, authPortalOtpCellClass } from '~/utils/authPortalClasses'

defineProps<{
  digits: string[]
  indices: number[]
}>()

const emit = defineEmits<{
  keydown: [event: KeyboardEvent, index: number]
  input: [event: Event, index: number]
  paste: [event: ClipboardEvent]
}>()
</script>

<template>
  <div class="space-y-2">
    <label :class="authPortalLabelClass">ONE-TIME CODE</label>
    <div class="grid grid-cols-8 gap-2 w-full">
      <input
        v-for="i in indices"
        :key="i"
        :value="digits[i]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :class="authPortalOtpCellClass"
        @keydown="emit('keydown', $event, i)"
        @input="emit('input', $event, i)"
        @paste="emit('paste', $event)"
      >
    </div>
  </div>
</template>
