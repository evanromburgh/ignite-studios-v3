<script setup lang="ts">
defineProps<{
  loading: boolean
  disabled?: boolean
  type?: 'submit' | 'button'
  /** e.g. flex-1 for button groups */
  uiClass?: string
}>()
</script>

<template>
  <button
    :type="type ?? 'submit'"
    :disabled="loading || disabled"
    :class="[
      'h-12 bg-[#18181B] text-[#ffffff] font-black text-[11px] uppercase tracking-wider rounded-lg hover:bg-[#27272a] transition-all flex items-center justify-center disabled:opacity-50',
      uiClass ?? 'w-full',
    ]"
  >
    <span v-if="loading" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    <span v-else><slot /></span>
  </button>
</template>
