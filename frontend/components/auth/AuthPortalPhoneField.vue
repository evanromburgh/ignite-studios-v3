<script setup lang="ts">
import type { PhoneCountry } from '~/data/phoneCountries'
import { formatPhoneDialCode, phoneCountries } from '~/data/phoneCountries'
import { authPortalLabelClass, authPortalPhoneNationalInputClass, authPortalPhoneRowClass } from '~/utils/authPortalClasses'

const props = defineProps<{
  modelValue: string
  dropdownOpen: boolean
  selectedCountry: PhoneCountry
}>()

const emit = defineEmits<{
  'update:dropdownOpen': [value: boolean]
  'select-country': [country: PhoneCountry]
  'national-input': [event: Event]
}>()

function phoneFlagUrl(countryCode: string) {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
}

function toggleDropdown() {
  emit('update:dropdownOpen', !props.dropdownOpen)
}
</script>

<template>
  <div class="space-y-2">
    <label :class="authPortalLabelClass">PHONE NUMBER</label>
    <div class="relative">
      <div :class="authPortalPhoneRowClass">
        <div class="relative shrink-0 h-full flex items-center">
          <button
            type="button"
            class="h-full flex items-center gap-1.5 pl-4 pr-2 text-zinc-400 hover:text-zinc-200 transition-colors"
            @click.stop="toggleDropdown"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-theme-input-bg"
              aria-hidden="true"
            >
              <img
                :src="phoneFlagUrl(selectedCountry.countryCode)"
                :alt="selectedCountry.countryCode"
                class="w-full h-full object-cover"
              >
            </span>
            <span class="text-[0.875rem]"
              >{{ formatPhoneDialCode(selectedCountry.dialCode) }} ({{ selectedCountry.countryCode }})</span
            >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <input
          :value="modelValue"
          required
          type="tel"
          maxlength="15"
          :class="authPortalPhoneNationalInputClass"
          @input="emit('national-input', $event)"
          @focus="emit('update:dropdownOpen', false)"
        >
      </div>
      <div
        v-if="dropdownOpen"
        class="absolute top-full left-0 mt-1 z-[100] max-h-64 overflow-auto rounded-lg border border-theme-border-strong bg-theme-surface-elevated shadow-xl py-1 min-w-[14rem]"
      >
        <button
          v-for="(c, i) in phoneCountries"
          :key="i"
          type="button"
          class="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-zinc-300 hover:bg-theme-input-bg hover:text-theme-text-primary transition-colors"
          @click.stop="emit('select-country', c)"
        >
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-theme-input-bg">
            <img :src="phoneFlagUrl(c.countryCode)" :alt="c.countryCode" class="w-full h-full object-cover">
          </span>
          <span>{{ formatPhoneDialCode(c.dialCode) }} ({{ c.countryCode }})</span>
        </button>
      </div>
    </div>
  </div>
</template>
