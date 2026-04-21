<template>
  <div class="fixed inset-0 z-[1000] bg-theme-bg flex items-center justify-center px-4 py-6 overflow-y-auto">
    <div class="w-full max-w-[28rem] sm:max-w-md my-auto space-y-6">
      <div v-if="(mode === 'main' && !forgotSuccess) || mode === 'forgot'" class="text-center">
        <template v-if="mode === 'forgot'">
          <h2 class="text-2xl sm:text-3xl font-semibold text-theme-text-primary tracking-tight">Reset password</h2>
          <p class="mt-2 text-zinc-500 text-sm">Enter your email and we’ll send you a link to reset your password.</p>
        </template>
        <template v-else-if="step === 1">
          <h2 class="text-2xl sm:text-3xl font-semibold text-theme-text-primary tracking-tight">Sign In or Create Account</h2>
          <p class="mt-2 text-zinc-500 text-sm">Enter your email to get started.</p>
        </template>
        <template v-else-if="step === 2 && accountExists === false">
          <h2 class="text-2xl sm:text-3xl font-semibold text-theme-text-primary tracking-tight">Create your account</h2>
        </template>
        <template v-else-if="step === 3 && accountExists === false">
          <h2 class="text-2xl sm:text-3xl font-semibold text-theme-text-primary tracking-tight">Finalize your account</h2>
        </template>
        <template v-else-if="step === 2 && accountExists === true">
          <h2 class="text-2xl sm:text-3xl font-semibold text-theme-text-primary tracking-tight">Welcome Back</h2>
          <p class="mt-2 text-zinc-500 text-sm">Choose a login method below.</p>
        </template>
        <template v-else-if="step === 3 && signInMethod === 'password'">
          <h2 class="text-2xl sm:text-3xl font-semibold text-theme-text-primary tracking-tight">Enter your password</h2>
        </template>
        <template v-else-if="step === 3 && signInMethod === 'email_code'">
          <h2 class="text-2xl sm:text-3xl font-semibold text-theme-text-primary tracking-tight">Check your email</h2>
          <p class="mt-2 text-zinc-500 text-sm">We sent a code to {{ email }}</p>
        </template>
      </div>

      <div class="border-beam-container rounded-2xl shadow-lg overflow-hidden group">
        <div class="border-beam-inner bg-theme-surface-elevated border-none rounded-[calc(1rem-1px)] p-6 sm:p-10 relative z-10 w-full">
          <div v-if="forgotSuccess" class="space-y-6 text-center">
            <p class="text-zinc-400 text-sm">Check your email for a link to reset your password.</p>
            <button
              type="button"
              class="text-sm font-bold text-zinc-300 hover:text-theme-text-primary underline transition-colors"
              @click="forgotSuccess = false; resetToStep1()"
            >
              Back to Sign In
            </button>
          </div>

          <form v-else-if="mode === 'forgot'" class="space-y-5" @submit.prevent="handleForgotSubmit">
            <div class="space-y-2">
              <label :class="authPortalLabelBlackClass">Email</label>
              <input v-model="email" required type="email" :class="authPortalInputClass" >
            </div>
            <div v-if="error" :class="[authPortalErrorClass, 'py-2']">{{ error }}</div>
            <AuthPortalSubmitButton :loading="loading">
              Send reset link
            </AuthPortalSubmitButton>
            <button
              type="button"
              class="block w-full text-sm text-zinc-500 hover:text-theme-text-primary transition-colors"
              @click="mode = 'main'; error = null; resetToStep1()"
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
                <div v-if="error" :class="authPortalErrorClass">{{ error }}</div>
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
                <div class="space-y-2">
                  <label :class="authPortalLabelClass">PHONE NUMBER</label>
                  <div class="relative">
                    <div
                      class="flex items-center bg-theme-input-bg border border-theme-border rounded-lg overflow-hidden focus-within:border-zinc-500 transition-all h-[46px]"
                    >
                      <div class="relative shrink-0 h-full flex items-center">
                        <button
                          type="button"
                          class="h-full flex items-center gap-1.5 pl-4 pr-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                          @click.stop="phoneCountryDropdownOpen = !phoneCountryDropdownOpen"
                        >
                          <span
                            class="inline-flex items-center justify-center w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-theme-input-bg"
                            aria-hidden="true"
                          >
                            <img
                              :src="phoneFlagUrl(selectedPhoneCountry.countryCode)"
                              :alt="selectedPhoneCountry.countryCode"
                              class="w-full h-full object-cover"
                            >
                          </span>
                          <span class="text-[0.875rem]"
                            >{{ formatPhoneDialCode(selectedPhoneCountry.dialCode) }} ({{
                              selectedPhoneCountry.countryCode
                            }})</span
                          >
                          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <input
                        :value="phone"
                        required
                        type="tel"
                        maxlength="15"
                        class="flex-1 h-full py-0 pl-4 pr-4 bg-transparent text-[#18181B] focus:outline-none text-base leading-[44px] min-w-0"
                        @input="onPhoneInput"
                        @focus="phoneCountryDropdownOpen = false"
                      >
                    </div>
                    <div
                      v-if="phoneCountryDropdownOpen"
                      class="absolute top-full left-0 mt-1 z-[100] max-h-64 overflow-auto rounded-lg border border-theme-border-strong bg-theme-surface-elevated shadow-xl py-1 min-w-[14rem]"
                    >
                      <button
                        v-for="(c, i) in phoneCountries"
                        :key="i"
                        type="button"
                        class="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-zinc-300 hover:bg-theme-input-bg hover:text-theme-text-primary transition-colors"
                        @click.stop="
                          selectPhoneCountry(c);
                          phoneCountryDropdownOpen = false
                        "
                      >
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-theme-input-bg">
                          <img :src="phoneFlagUrl(c.countryCode)" :alt="c.countryCode" class="w-full h-full object-cover">
                        </span>
                        <span>{{ formatPhoneDialCode(c.dialCode) }} ({{ c.countryCode }})</span>
                      </button>
                    </div>
                  </div>
                </div>
                <AuthPortalPasswordField
                  v-model="password"
                  autocomplete="new-password"
                  show-strength
                  :minlength="passwordMinLength"
                >
                  <template #label>CREATE PASSWORD</template>
                </AuthPortalPasswordField>
                <div v-if="error" :class="authPortalErrorClass">{{ error }}</div>
                <AuthPortalSubmitButton :loading="loading">Continue</AuthPortalSubmitButton>
              </form>
            </template>

            <template v-else-if="step === 3 && accountExists === false">
              <AuthPortalContextBanner
                label="FINALIZE ACCOUNT"
                :email="email"
                back-label="Back"
                @back="step = 2"
              />
              <form class="space-y-5" @submit.prevent="handleCreateAccount">
                <div class="space-y-2">
                  <label :class="authPortalLabelClass"> ID / Passport Number </label>
                  <input v-model="idPassport" required type="text" :class="authPortalInputClass" >
                </div>
                <div class="space-y-2">
                  <label :class="authPortalLabelClass"> I am interested in </label>
                  <div class="relative">
                    <select
                      v-model="reasonForBuying"
                      required
                      class="w-full bg-theme-input-bg border border-theme-border rounded-lg pl-4 pr-10 h-11 pt-[11px] pb-[11px] leading-[1.25] focus:border-zinc-500 focus:outline-none text-[#18181B] text-base transition-all appearance-none cursor-pointer"
                    >
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
                <div v-if="error" :class="authPortalErrorClass">{{ error }}</div>
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
                <button
                  type="button"
                  class="w-full h-12 bg-transparent border border-theme-border-strong text-theme-text-primary font-black text-[11px] uppercase tracking-wider rounded-lg hover:bg-theme-input-bg transition-all"
                  @click="
                    signInMethod = 'password';
                    step = 3
                  "
                >
                  Continue with password
                </button>
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
                <div v-if="error" :class="authPortalErrorClass">{{ error }}</div>
                <div class="flex gap-3">
                  <button
                    type="button"
                    class="flex-1 h-12 bg-transparent border border-theme-border-strong text-theme-text-primary font-black text-[11px] uppercase tracking-wider rounded-lg hover:bg-theme-input-bg transition-all"
                    @click="backToSignInMethods"
                  >
                    Back
                  </button>
                  <AuthPortalSubmitButton :loading="loading" ui-class="flex-1">Sign In</AuthPortalSubmitButton>
                </div>
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
                <div class="space-y-2">
                  <label :class="authPortalLabelClass">ONE-TIME CODE</label>
                  <div class="grid grid-cols-8 gap-2 w-full">
                    <input
                      v-for="i in otpSlotIndices"
                      :key="i"
                      :value="otpDigits[i]"
                      type="text"
                      inputmode="numeric"
                      maxlength="1"
                      class="w-full min-w-0 h-12 text-center text-lg font-bold bg-theme-input-bg border border-theme-border rounded-lg text-[#18181B] focus:border-zinc-500 focus:outline-none transition-all"
                      @keydown="onOtpKeydown($event, i)"
                      @input="onOtpSingleInput($event, i)"
                      @paste="onOtpPaste($event)"
                    >
                  </div>
                </div>
                <div v-if="error" :class="authPortalErrorClass">{{ error }}</div>
                <div class="flex gap-3">
                  <button
                    type="button"
                    class="flex-1 h-12 bg-transparent border border-theme-border-strong text-theme-text-primary font-black text-[11px] uppercase tracking-wider rounded-lg hover:bg-theme-input-bg transition-all"
                    @click="backToSignInMethods"
                  >
                    Back
                  </button>
                  <AuthPortalSubmitButton
                    :loading="loading"
                    :disabled="otpCode.length !== AUTH_OTP_LENGTH"
                    ui-class="flex-1"
                  >
                    Verify
                  </AuthPortalSubmitButton>
                </div>
              </form>
            </template>
          </template>
        </div>
      </div>

      <div v-if="mode === 'main' && step >= 1" class="flex flex-col items-center gap-1">
        <button
          type="button"
          class="text-sm font-medium text-zinc-500 hover:text-theme-text-primary transition-colors"
          @click="mode = 'forgot'; resetToStep1()"
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
import AuthPortalPasswordField from '~/components/auth/AuthPortalPasswordField.vue'
import AuthPortalSubmitButton from '~/components/auth/AuthPortalSubmitButton.vue'
import { useAuthPortal } from '~/composables/useAuthPortal'

const {
  AUTH_OTP_LENGTH,
  REASON_FOR_BUYING_OPTIONS,
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
  phoneCountries,
  formatPhoneDialCode,
  phoneFlagUrl,
  selectPhoneCountry,
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
  resetToStep1,
  goBackToStep1,
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
  authPortalErrorClass,
} = useAuthPortal()
</script>
