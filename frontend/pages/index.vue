<template>
  <ClientOnly>
    <!-- Fixed shell so SSR + pre-hydration paint hide layout nav (nav is z-[170], fixed). -->
    <template #fallback>
      <div class="fixed inset-0 z-[1000] bg-theme-bg" aria-hidden="true" />
    </template>
    <div
      v-if="authLoading"
      class="fixed inset-0 z-[1000] bg-theme-bg flex items-center justify-center px-5"
    >
      <p class="text-sm text-theme-text-muted">Loading&hellip;</p>
    </div>
    <AuthPortal v-else-if="!user" />
    <div v-else class="min-h-screen">
      <header
        class="nav-section dark relative min-h-svh h-svh sm:min-h-screen sm:h-screen overflow-hidden bg-theme-bg"
      >
        <div class="absolute inset-0 z-10 bg-black/40 pointer-events-none" aria-hidden="true" />
        <div
          class="absolute inset-0 z-[5] bg-cover bg-center opacity-90"
          :style="{ backgroundImage: `url(${heroBackdrop})` }"
          aria-hidden="true"
        />
        <div
          class="relative z-20 flex min-h-full flex-col justify-center items-center px-5 pt-0 pb-0 sm:pt-24 sm:pb-32 sm:px-8 md:px-24 lg:px-40 xl:px-56 pointer-events-none"
        >
          <h1 class="text-center text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-3">
            Browse Units
          </h1>
          <p class="text-center text-sm sm:text-base text-zinc-300/90 font-medium mt-1 uppercase tracking-[0.2em]">
            Apartments
          </p>
        </div>
      </header>

      <section class="bg-theme-bg w-full px-5 sm:px-8 md:px-24 pt-10 pb-20">
        <div class="mx-auto max-w-3xl text-center">
          <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-theme-text-primary">
            Choose your view
          </p>
          <p class="mt-1 text-[13px] text-theme-text-primary">
            Switch how you browse units:
            <span class="font-semibold">Grid</span>,
            <span class="font-semibold">List</span>, or
            <span class="font-semibold">Plans</span>.
          </p>
          <p class="mt-8 text-sm text-theme-text-muted">
            Browse experience ships in the next stage — layout and chrome match the reference.
          </p>
        </div>
      </section>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { user, authLoading } = useAuth()
const { seoImageUrl } = useBranding()
const heroBackdrop = seoImageUrl
</script>
