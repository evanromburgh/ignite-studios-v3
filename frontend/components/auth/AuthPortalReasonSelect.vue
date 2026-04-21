<script setup lang="ts">
import { REASON_FOR_BUYING_OPTIONS } from '~/data/reasonForBuyingOptions'
import { authPortalLabelClass, authPortalSelectClass } from '~/utils/authPortalClasses'

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="space-y-2">
    <label :class="authPortalLabelClass"> I am interested in </label>
    <div class="relative">
      <select v-model="model" required :class="authPortalSelectClass">
        <option value="" disabled>Select a reason</option>
        <option v-for="opt in REASON_FOR_BUYING_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <svg
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>
