import { computed, ref } from 'vue'

export function useOtpDigits(length: number) {
  const otpDigits = ref<string[]>(Array.from({ length }, () => ''))
  const otpCode = computed(() => otpDigits.value.join(''))
  const otpSlotIndices = computed(() => Array.from({ length }, (_, i) => i))

  function resetOtp() {
    otpDigits.value = Array.from({ length }, () => '')
  }

  function onOtpSingleInput(e: Event, index: number) {
    const target = e.target as HTMLInputElement
    const char = target.value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits.value]
    next[index] = char
    otpDigits.value = Array.from({ length }, (_, i) => next[i] ?? '')
    if (char && index < length - 1) (target.nextElementSibling as HTMLInputElement)?.focus()
  }

  function onOtpKeydown(e: KeyboardEvent, index: number) {
    if (e.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
      const next = [...otpDigits.value]
      next[index - 1] = ''
      otpDigits.value = Array.from({ length }, (_, i) => next[i] ?? '')
      const el = (e.target as HTMLElement).previousElementSibling as HTMLInputElement | null
      el?.focus()
    }
  }

  function onOtpPaste(e: ClipboardEvent) {
    e.preventDefault()
    const pasted = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const digits = pasted.split('')
    otpDigits.value = Array.from({ length }, (_, i) => digits[i] ?? '')
    const nextIndex = Math.min(digits.length, length - 1)
    const container = (e.target as HTMLElement).parentElement
    const inputs = container?.querySelectorAll<HTMLInputElement>('input')
    inputs?.[nextIndex]?.focus()
  }

  return {
    otpDigits,
    otpCode,
    otpSlotIndices,
    resetOtp,
    onOtpSingleInput,
    onOtpKeydown,
    onOtpPaste,
  }
}
