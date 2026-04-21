import type { PhoneCountry } from '~/data/phoneCountries'
import { computed, ref } from 'vue'
import { AUTH_OTP_LENGTH, CONFIG } from '~/config'
import { validateEmailWithConfirm, validateSingleEmail } from '~/utils/authEmail'
import { authErrorMessage } from '~/utils/authErrorMessage'
import { authPortalInputClass, authPortalLabelBlackClass, authPortalLabelClass } from '~/utils/authPortalClasses'
import { validateSignupIdentity } from '~/utils/authSignupValidation'
import { useAuth } from '~/composables/useAuth'
import { useAuthPortalProgress, type AuthPortalStep } from '~/composables/useAuthPortalProgress'
import { useOtpDigits } from '~/composables/useOtpDigits'
import { usePhoneCountryField } from '~/composables/usePhoneCountryField'

export function useAuthPortal() {
  const { signUp, login, resetPasswordForEmail, signInWithOtp, verifyOtp, checkEmailExists } = useAuth()

  const mode = ref<'main' | 'forgot'>('main')
  const step = ref<AuthPortalStep>(1)
  const { progressStep } = useAuthPortalProgress(step)
  const accountExists = ref<boolean | null>(null)
  const signInMethod = ref<'password' | 'email_code' | null>(null)

  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const confirmEmail = ref('')
  const password = ref('')
  const idPassport = ref('')
  const reasonForBuying = ref('')

  const {
    phone,
    phoneCountryDropdownOpen,
    selectedPhoneCountry,
    selectPhoneCountry,
    onPhoneInput,
    fullE164,
  } = usePhoneCountryField()

  const {
    otpDigits,
    otpCode,
    otpSlotIndices,
    resetOtp,
    onOtpSingleInput,
    onOtpKeydown,
    onOtpPaste,
  } = useOtpDigits(AUTH_OTP_LENGTH)

  const error = ref<string | null>(null)
  const loading = ref(false)
  const forgotSuccess = ref(false)

  const passwordMinLength = CONFIG.PASSWORD_MIN_LENGTH

  const showPortalHeading = computed(
    () => (mode.value === 'main' && !forgotSuccess.value) || mode.value === 'forgot',
  )

  const portalHeading = computed((): { title: string; subtitle?: string } => {
    if (mode.value === 'forgot') {
      return {
        title: 'Reset password',
        subtitle: 'Enter your email and we’ll send you a link to reset your password.',
      }
    }
    if (step.value === 1) {
      return {
        title: 'Sign In or Create Account',
        subtitle: 'Enter your email to get started.',
      }
    }
    if (step.value === 2 && accountExists.value === false) {
      return { title: 'Create your account' }
    }
    if (step.value === 3 && accountExists.value === false) {
      return { title: 'Finalize your account' }
    }
    if (step.value === 2 && accountExists.value === true) {
      return {
        title: 'Welcome Back',
        subtitle: 'Choose a login method below.',
      }
    }
    if (step.value === 3 && signInMethod.value === 'password') {
      return { title: 'Enter your password' }
    }
    if (step.value === 3 && signInMethod.value === 'email_code') {
      return {
        title: 'Check your email',
        subtitle: `We sent a code to ${email.value}`,
      }
    }
    return { title: '' }
  })

  function resetToStep1() {
    step.value = 1
    progressStep.value = 1
    accountExists.value = null
    signInMethod.value = null
    error.value = null
    resetOtp()
  }

  function goBackToStep1() {
    resetToStep1()
    email.value = ''
    confirmEmail.value = ''
  }

  function switchToForgotMode() {
    mode.value = 'forgot'
    resetToStep1()
  }

  function returnFromForgotToMain() {
    mode.value = 'main'
    error.value = null
    resetToStep1()
  }

  function clearForgotSuccessAndReset() {
    forgotSuccess.value = false
    resetToStep1()
  }

  function goToSignupDetailsStep() {
    step.value = 2
  }

  function onSelectPhoneCountry(c: PhoneCountry) {
    selectPhoneCountry(c)
    phoneCountryDropdownOpen.value = false
  }

  function choosePasswordSignIn() {
    signInMethod.value = 'password'
    step.value = 3
  }

  function validateEmailStep(): boolean {
    error.value = null
    const result = validateEmailWithConfirm(email.value, confirmEmail.value)
    if (!result.ok) {
      error.value = result.message
      return false
    }
    return true
  }

  async function handleStep1Continue() {
    if (!validateEmailStep()) return
    loading.value = true
    error.value = null
    try {
      const exists = await checkEmailExists(email.value.trim())
      accountExists.value = exists
      step.value = 2
      if (exists) signInMethod.value = null
    } catch {
      error.value = 'Something went wrong. Please try again.'
      accountExists.value = false
      step.value = 2
    } finally {
      loading.value = false
    }
  }

  async function handleContinueWithEmailCode() {
    loading.value = true
    error.value = null
    try {
      await signInWithOtp(email.value.trim())
      signInMethod.value = 'email_code'
      step.value = 3
      resetOtp()
    } catch (err: unknown) {
      error.value = authErrorMessage(err, 'Failed to send code. Try again.')
    } finally {
      loading.value = false
    }
  }

  function handleCreateAccountStep2() {
    error.value = null
    const msg = validateSignupIdentity(firstName.value, lastName.value, password.value)
    if (msg) {
      error.value = msg
      return
    }
    step.value = 3
  }

  async function handleCreateAccount() {
    error.value = null
    const msg = validateSignupIdentity(firstName.value, lastName.value, password.value)
    if (msg) {
      error.value = msg
      return
    }
    if (!idPassport.value.trim()) {
      error.value = 'ID / Passport Number is required.'
      return
    }
    if (!reasonForBuying.value.trim()) {
      error.value = 'Reason for Buying is required.'
      return
    }
    loading.value = true
    try {
      const fullName = `${firstName.value} ${lastName.value}`.trim()
      await signUp(
        email.value,
        password.value,
        fullName,
        firstName.value,
        lastName.value,
        fullE164(),
        idPassport.value.trim(),
        reasonForBuying.value.trim(),
      )
      await navigateTo('/')
    } catch (err: unknown) {
      error.value = authErrorMessage(err, 'Something went wrong.')
    } finally {
      loading.value = false
    }
  }

  async function handleSignInWithPassword() {
    error.value = null
    loading.value = true
    try {
      await login(email.value, password.value)
      await navigateTo('/')
    } catch (err: unknown) {
      error.value = authErrorMessage(err, 'Invalid password.')
    } finally {
      loading.value = false
    }
  }

  async function handleVerifyOtp() {
    if (otpCode.value.length !== AUTH_OTP_LENGTH) return
    error.value = null
    loading.value = true
    try {
      await verifyOtp(email.value.trim(), otpCode.value)
      await navigateTo('/')
    } catch (err: unknown) {
      error.value = authErrorMessage(err, 'Invalid or expired code.')
    } finally {
      loading.value = false
    }
  }

  async function handleForgotSubmit() {
    error.value = null
    const result = validateSingleEmail(email.value)
    if (!result.ok) {
      error.value = result.message
      return
    }
    loading.value = true
    error.value = null
    try {
      await resetPasswordForEmail(result.email)
      forgotSuccess.value = true
    } catch (err: unknown) {
      error.value = authErrorMessage(err, 'Something went wrong.')
    } finally {
      loading.value = false
    }
  }

  function backToSignInMethods() {
    step.value = 2
  }

  return {
    AUTH_OTP_LENGTH,
    mode,
    step,
    progressStep,
    accountExists,
    signInMethod,
    firstName,
    lastName,
    email,
    confirmEmail,
    password,
    idPassport,
    reasonForBuying,
    phone,
    phoneCountryDropdownOpen,
    selectedPhoneCountry,
    onPhoneInput,
    otpDigits,
    otpCode,
    otpSlotIndices,
    onOtpSingleInput,
    onOtpKeydown,
    onOtpPaste,
    error,
    loading,
    forgotSuccess,
    passwordMinLength,
    showPortalHeading,
    portalHeading,
    resetToStep1,
    goBackToStep1,
    switchToForgotMode,
    returnFromForgotToMain,
    clearForgotSuccessAndReset,
    goToSignupDetailsStep,
    onSelectPhoneCountry,
    choosePasswordSignIn,
    handleStep1Continue,
    handleContinueWithEmailCode,
    handleCreateAccountStep2,
    handleCreateAccount,
    handleSignInWithPassword,
    handleVerifyOtp,
    handleForgotSubmit,
    backToSignInMethods,
    authPortalInputClass,
    authPortalLabelClass,
    authPortalLabelBlackClass,
  }
}
