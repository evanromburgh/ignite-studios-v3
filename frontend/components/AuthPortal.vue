<template>
  <div class="fixed inset-0 z-[1000] bg-theme-bg flex items-center justify-center px-4 py-6 overflow-y-auto">
    <div class="w-full max-w-[28rem] sm:max-w-md my-auto space-y-6">
      <div v-if="showPortalHeading && portalHeading.title">
        <AuthPortalHeading :title="portalHeading.title" :subtitle="portalHeading.subtitle" />
      </div>

      <div class="border-beam-container rounded-2xl shadow-lg overflow-hidden group">
        <div class="border-beam-inner bg-theme-surface-elevated border-none rounded-[calc(1rem-1px)] p-6 sm:p-10 relative z-10 w-full">
          <div v-if="forgotSuccess" class="space-y-6 text-center">
            <p class="text-zinc-400 text-sm">Check your email for a link to reset your password.</p>
            <button
              type="button"
              class="text-sm font-bold text-zinc-300 hover:text-theme-text-primary underline transition-colors"
              @click="clearForgotSuccessAndReset"
            >
              Back to Sign In
            </button>
          </div>

          <form v-else-if="mode === 'forgot'" class="space-y-5" @submit.prevent="handleForgotSubmit">
            <div class="space-y-2">
              <label :class="authPortalLabelBlackClass">Email</label>
              <input v-model="email" required type="email" :class="authPortalInputClass" >
            </div>
            <AuthPortalFieldError :message="error" padded />
            <AuthPortalSubmitButton :loading="loading">
              Send reset link
            </AuthPortalSubmitButton>
            <button
              type="button"
              class="block w-full text-sm text-zinc-500 hover:text-theme-text-primary transition-colors"
              @click="returnFromForgotToMain"
            >
              Back to Sign In
            </button>
          </form>

          <template v-else>
            <StepIndicator :current-step="step" :fill-step="progressStep" />

            <template v-if="step === 1">
              <form class="space-y-5 mt-6" @submit.prevent="handleStep1Continue">
                <div class="space-y-2">
                  <label :class="authPortalLabelClass">EMAIL ADDRESS</label>
                  <input v-model="email" required type="email" :class="authPortalInputClass" >
                </div>
                <div class="space-y-2">
                  <label :class="authPortalLabelClass">CONFIRM EMAIL</label>
                  <input v-model="confirmEmail" required type="email" :class="authPortalInputClass" >
                </div>
                <AuthPortalFieldError :message="error" />
                <AuthPortalSubmitButton :loading="loading" ui-class="w-full mt-6"> Continue </AuthPortalSubmitButton>
              </form>
            </template>

            <template v-else-if="step === 2 && accountExists === false">
              <AuthPortalContextBanner
                label="CREATING ACCOUNT FOR"
                :email="email"
                back-label="Change"
                @back="goBackToStep1"
              />
              <form class="space-y-5" @submit.prevent="handleCreateAccountStep2">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label :class="authPortalLabelClass">FIRST NAME</label>
                    <input v-model="firstName" required type="text" :class="authPortalInputClass" >
                  </div>
                  <div class="space-y-2">
                    <label :class="authPortalLabelClass">LAST NAME</label>
                    <input v-model="lastName" required type="text" :class="authPortalInputClass" >
                  </div>
                </div>
                <AuthPortalPhoneField
                  v-model:dropdown-open="phoneCountryDropdownOpen"
                  :model-value="phone"
                  :selected-country="selectedPhoneCountry"
                  @national-input="onPhoneInput"
                  @select-country="onSelectPhoneCountry"
                />
                <AuthPortalPasswordField
                  v-model="password"
                  autocomplete="new-password"
                  show-strength
                  :minlength="passwordMinLength"
                >
                  <template #label>CREATE PASSWORD</template>
                </AuthPortalPasswordField>
                <AuthPortalFieldError :message="error" />
                <AuthPortalSubmitButton :loading="loading">Continue</AuthPortalSubmitButton>
              </form>
            </template>

            <template v-else-if="step === 3 && accountExists === false">
              <AuthPortalContextBanner
                label="FINALIZE ACCOUNT"
                :email="email"
                back-label="Back"
                @back="goToSignupDetailsStep"
              />
              <form class="space-y-5" @submit.prevent="handleCreateAccount">
                <div class="space-y-2">
                  <label :class="authPortalLabelClass"> ID / Passport Number </label>
                  <input v-model="idPassport" required type="text" :class="authPortalInputClass" >
                </div>
                <AuthPortalReasonSelect v-model="reasonForBuying" />
                <AuthPortalFieldError :message="error" />
                <AuthPortalSubmitButton :loading="loading">Create Account</AuthPortalSubmitButton>
              </form>
            </template>

            <template v-else-if="step === 2 && accountExists === true">
              <AuthPortalContextBanner
                label="SIGNING IN AS"
                :email="email"
                back-label="Change"
                @back="goBackToStep1"
              />
              <div class="space-y-3">
                <AuthPortalSubmitButton type="button" :loading="loading" @click="handleContinueWithEmailCode">
                  Continue with email code
                </AuthPortalSubmitButton>
                <AuthPortalSecondaryButton @click="choosePasswordSignIn">
                  Continue with password
                </AuthPortalSecondaryButton>
              </div>
            </template>

            <template v-else-if="step === 3 && signInMethod === 'password'">
              <AuthPortalContextBanner
                label="SIGNING IN AS"
                :email="email"
                back-label="Change"
                @back="backToSignInMethods"
              />
              <form class="space-y-5" @submit.prevent="handleSignInWithPassword">
                <input type="email" name="email" autocomplete="username" class="hidden" :value="email" aria-hidden="true" tabindex="-1">
                <AuthPortalPasswordField v-model="password" autocomplete="current-password" label-black>
                  <template #label>PASSWORD</template>
                </AuthPortalPasswordField>
                <AuthPortalFieldError :message="error" />
                <AuthPortalFormActions :loading="loading" @back="backToSignInMethods">
                  Sign In
                </AuthPortalFormActions>
              </form>
            </template>

            <template v-else-if="step === 3 && signInMethod === 'email_code'">
              <AuthPortalContextBanner
                label="SIGNING IN AS"
                :email="email"
                back-label="Change"
                @back="backToSignInMethods"
              />
              <form class="space-y-6" @submit.prevent="handleVerifyOtp">
                <AuthPortalOtpInputs
                  :digits="otpDigits"
                  :indices="otpSlotIndices"
                  @keydown="onOtpKeydown"
                  @input="onOtpSingleInput"
                  @paste="onOtpPaste"
                />
                <AuthPortalFieldError :message="error" />
                <AuthPortalFormActions
                  :loading="loading"
                  :disabled="otpCode.length !== AUTH_OTP_LENGTH"
                  @back="backToSignInMethods"
                >
                  Verify
                </AuthPortalFormActions>
              </form>
            </template>
          </template>
        </div>
      </div>

      <div v-if="mode === 'main' && step >= 1" class="flex flex-col items-center gap-1">
        <button
          type="button"
          class="text-sm font-medium text-zinc-500 hover:text-theme-text-primary transition-colors"
          @click="switchToForgotMode"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StepIndicator from '~/components/auth/StepIndicator.vue'
import AuthPortalContextBanner from '~/components/auth/AuthPortalContextBanner.vue'
import AuthPortalFieldError from '~/components/auth/AuthPortalFieldError.vue'
import AuthPortalFormActions from '~/components/auth/AuthPortalFormActions.vue'
import AuthPortalHeading from '~/components/auth/AuthPortalHeading.vue'
import AuthPortalOtpInputs from '~/components/auth/AuthPortalOtpInputs.vue'
import AuthPortalPasswordField from '~/components/auth/AuthPortalPasswordField.vue'
import AuthPortalPhoneField from '~/components/auth/AuthPortalPhoneField.vue'
import AuthPortalReasonSelect from '~/components/auth/AuthPortalReasonSelect.vue'
import AuthPortalSecondaryButton from '~/components/auth/AuthPortalSecondaryButton.vue'
import AuthPortalSubmitButton from '~/components/auth/AuthPortalSubmitButton.vue'
import { useAuthPortal } from '~/composables/useAuthPortal'

const {
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
} = useAuthPortal()
</script>
