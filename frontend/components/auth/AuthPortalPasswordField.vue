<script setup lang="ts">
import { computed, ref } from 'vue'
import { CONFIG } from '~/config'

const props = withDefaults(
  defineProps<{
    modelValue: string
    autocomplete: string
    /** Sign-up step shows strength meter */
    showStrength?: boolean
    minlength?: number
    /** Match reference: sign-in uses black label weight */
    labelBlack?: boolean
  }>(),
  { labelBlack: false, minlength: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const showPassword = ref(false)

const passwordStrength = computed(() => {
  const pw = props.modelValue
  let score = 0
  if (pw.length >= CONFIG.PASSWORD_MIN_LENGTH) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400' }
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-400' }
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-400' }
  return { score, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' }
})
</script>

<template>
  <div class="space-y-2">
    <label
      class="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-[0.2em] sm:tracking-[0.1em] block"
      :class="labelBlack ? 'font-black' : 'font-semibold'"
    >
      <slot name="label">PASSWORD</slot>
    </label>
    <div
      class="relative flex items-center bg-theme-input-bg border border-theme-border rounded-lg h-[46px] focus-within:border-zinc-500 transition-all"
    >
      <input
        :value="modelValue"
        required
        :autocomplete="autocomplete"
        :type="showPassword ? 'text' : 'password'"
        :minlength="minlength"
        class="auth-password-input w-full h-full pl-4 pr-10 bg-transparent py-0 leading-[44px] text-[#18181B] focus:outline-none text-base rounded-lg"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        type="button"
        class="absolute right-3 text-zinc-500 hover:text-zinc-300 text-xs"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? 'Hide' : 'Show' }}
      </button>
    </div>
    <div v-if="showStrength && modelValue.length > 0" class="flex items-center gap-2 pt-1">
      <div class="flex-1 flex gap-1">
        <div
          v-for="i in 5"
          :key="i"
          class="h-1 flex-1 rounded-full"
          :class="i <= passwordStrength.score ? passwordStrength.color : 'bg-theme-border'"
        />
      </div>
      <span class="text-[9px] font-black uppercase tracking-widest" :class="passwordStrength.textColor">{{
        passwordStrength.label
      }}</span>
    </div>
  </div>
</template>
