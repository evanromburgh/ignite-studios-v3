<template>
  <div class="min-h-screen bg-theme-bg px-5 py-16 sm:px-8 md:px-24">
    <div class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-theme-text-muted">Unit detail</p>
      <h1 class="mt-3 text-2xl font-bold text-theme-text-primary">Unit {{ unitNumber }}</h1>
      <p class="mt-4 text-sm text-theme-text-muted">
        Full parity for the unit detail page ships in a later slice; browse and navigation are wired.
      </p>
      <NuxtLink
        to="/"
        class="mt-8 inline-flex text-sm font-semibold text-zinc-900 underline underline-offset-4"
      >
        Back to browse
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const unitNumber = computed(() => String(route.params.unitNumber ?? ''))
</script>
