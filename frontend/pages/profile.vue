<template>
  <ClientOnly>
    <template #fallback>
      <div class="min-h-[50vh] bg-theme-bg" aria-hidden="true" />
    </template>
    <div
      v-if="authLoading || user"
      class="nav-section light px-5 sm:px-8 md:px-24 lg:px-40 xl:px-56 pt-[7.5rem] sm:pt-[11rem] sm:pb-20"
    >
        <header class="mb-10 sm:mb-16">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-theme-text-primary tracking-tight mb-2">
            My Profile
          </h1>
          <p class="text-base sm:text-lg text-zinc-500 font-normal max-w-3xl">
            View the details of your Ignite Studios account.
          </p>
        </header>

        <div v-if="authLoading" class="rounded-xl border border-theme-border bg-theme-surface p-8 sm:p-12 text-center">
          <p class="text-zinc-500 text-base sm:text-lg">Loading your profile&hellip;</p>
        </div>

        <div v-else-if="user" class="flex flex-col gap-6 lg:gap-8">
          <section
            class="relative flex flex-col rounded-[0.75rem] px-6 py-6 sm:px-8 sm:py-8 border border-zinc-200 bg-white"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div class="space-y-0">
                <div class="flex items-baseline justify-between gap-8 pb-4 border-b border-zinc-200">
                  <span class="w-1/2 pl-4 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                    First Name:
                  </span>
                  <span class="w-1/2 pr-4 text-sm sm:text-base text-zinc-900 text-right">
                    {{ user.firstName || 'Not provided' }}
                  </span>
                </div>

                <div class="flex items-baseline justify-between gap-8 py-4 border-b border-zinc-200">
                  <span class="w-1/2 pl-4 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                    Last Name:
                  </span>
                  <span class="w-1/2 pr-4 text-sm sm:text-base text-zinc-900 text-right">
                    {{ user.lastName || 'Not provided' }}
                  </span>
                </div>

                <div class="flex items-baseline justify-between gap-8 pt-4">
                  <span class="w-1/2 pl-4 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                    Email Address:
                  </span>
                  <span class="w-1/2 pr-4 text-sm sm:text-base text-zinc-900 break-all text-right">
                    {{ user.email || 'Not provided' }}
                  </span>
                </div>
              </div>

              <div class="space-y-0 mt-6 md:mt-0">
                <div class="flex items-baseline justify-between gap-8 pb-4 border-b border-zinc-200">
                  <span class="w-1/2 pl-4 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                    Phone Number:
                  </span>
                  <span class="w-1/2 pr-4 text-sm sm:text-base text-zinc-900 text-right">
                    {{ user.phone || 'Not provided' }}
                  </span>
                </div>

                <div class="flex items-baseline justify-between gap-8 py-4 border-b border-zinc-200">
                  <span class="w-1/2 pl-4 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                    ID / Passport Number:
                  </span>
                  <span class="w-1/2 pr-4 text-sm sm:text-base text-zinc-900 break-all text-right">
                    {{ user.idPassportNumber || 'Not provided' }}
                  </span>
                </div>

                <div class="flex items-baseline justify-between gap-8 pt-4">
                  <span class="w-1/2 pl-4 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                    Reason for Buying:
                  </span>
                  <span class="w-1/2 pr-4 text-sm sm:text-base text-zinc-900 text-right">
                    {{ user.reasonForBuying || 'Not provided' }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <aside>
            <div class="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4 justify-start max-w-md">
              <button
                type="button"
                class="inline-flex items-center justify-center h-11 px-9 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] bg-[#18181B] text-white hover:bg-black transition-colors w-full sm:w-auto sm:min-w-[10rem] text-center"
                @click="handleSignOut"
              >
                {{ isLoggingOut ? 'Ending Session...' : 'Sign Out' }}
              </button>
            </div>
          </aside>
        </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { user, authLoading, logout } = useAuth()

const isLoggingOut = ref(false)

/** One auth entry: same full-screen AuthPortal as `/` (see `pages/index.vue`). */
watch(
  [user, authLoading],
  () => {
    if (!import.meta.client) return
    if (!authLoading.value && !user.value) {
      void navigateTo('/', { replace: true })
    }
  },
  { immediate: true },
)

function handleSignOut() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  void logout().finally(() => {
    isLoggingOut.value = false
  })
}
</script>
