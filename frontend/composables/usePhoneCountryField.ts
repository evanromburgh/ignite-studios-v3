import { onBeforeUnmount, ref, watch } from 'vue'
import { formatPhoneDialCode, phoneCountries, type PhoneCountry } from '~/data/phoneCountries'

export function usePhoneCountryField() {
  const phone = ref('')
  const phoneCountryDropdownOpen = ref(false)
  const selectedPhoneCountry = ref(
    phoneCountries.find((c) => c.countryCode === 'ZA') ?? phoneCountries[0],
  )

  function phoneFlagUrl(countryCode: string) {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
  }

  function selectPhoneCountry(c: PhoneCountry) {
    selectedPhoneCountry.value = c
  }

  let closeDropdownOnClick: (() => void) | null = null
  watch(phoneCountryDropdownOpen, (open) => {
    if (closeDropdownOnClick) {
      document.removeEventListener('click', closeDropdownOnClick)
      closeDropdownOnClick = null
    }
    if (open) {
      closeDropdownOnClick = () => {
        phoneCountryDropdownOpen.value = false
        document.removeEventListener('click', closeDropdownOnClick!)
      }
      setTimeout(() => document.addEventListener('click', closeDropdownOnClick!))
    }
  })

  onBeforeUnmount(() => {
    if (closeDropdownOnClick) document.removeEventListener('click', closeDropdownOnClick)
  })

  function onPhoneInput(event: Event) {
    const target = event.target as HTMLInputElement
    let digits = target.value.replace(/\D/g, '')
    if (digits.startsWith('0')) digits = digits.substring(1)
    const current = selectedPhoneCountry.value
    if (digits.startsWith(current.dialCode)) {
      phone.value = digits.slice(current.dialCode.length)
    } else {
      phone.value = digits
    }
    if (phone.value.startsWith('0')) {
      phone.value = phone.value.substring(1)
    }
  }

  function fullE164() {
    return `+${selectedPhoneCountry.value.dialCode}${phone.value}`
  }

  return {
    phone,
    phoneCountryDropdownOpen,
    selectedPhoneCountry,
    phoneCountries,
    formatPhoneDialCode,
    phoneFlagUrl,
    selectPhoneCountry,
    onPhoneInput,
    fullE164,
  }
}
