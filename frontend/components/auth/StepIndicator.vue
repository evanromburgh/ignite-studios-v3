<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-1">
      <span
        class="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.1em] transition-colors"
        :class="currentStep === 1 ? 'text-theme-text-primary' : 'text-zinc-500'"
      >
        STEP 1
      </span>
      <span
        class="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.1em] transition-colors"
        :class="currentStep === 2 ? 'text-theme-text-primary' : 'text-zinc-500'"
      >
        STEP 2
      </span>
      <span
        class="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.1em] transition-colors"
        :class="currentStep === 3 ? 'text-theme-text-primary' : 'text-zinc-500'"
      >
        STEP 3
      </span>
    </div>
    <div class="w-full mt-1.5 h-[0.35rem] rounded-full overflow-hidden bg-theme-border">
      <div
        class="h-full rounded-full transition-[width] duration-500 ease-out bg-[#18181B]"
        :style="{ width: fillWidth }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentStep: 1 | 2 | 3
  fillStep?: 1 | 2 | 3
}>()

const stepForFill = computed(() => props.fillStep ?? props.currentStep)

const STEP_WIDTHS: Record<1 | 2 | 3, string> = {
  1: '16%',
  2: '50%',
  3: '84%',
}
const fillWidth = computed(() => STEP_WIDTHS[stepForFill.value])
</script>
