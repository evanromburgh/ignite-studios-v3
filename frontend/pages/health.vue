<template>
  <div class="mx-auto max-w-3xl px-5 py-12 sm:py-16">
    <h1 class="text-xl font-semibold text-theme-text-primary">Supabase connectivity</h1>
    <p v-if="pending" class="mt-2 text-sm text-theme-text-muted">Loading…</p>
    <pre
      v-else
      class="mt-4 overflow-x-auto rounded-lg border border-theme-border bg-theme-surface p-4 text-xs text-theme-text-primary"
      >{{ json }}</pre
    >
    <NuxtLink class="mt-6 inline-block text-sm font-medium text-theme-text-muted underline" to="/">
      ← Home
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { data, pending } = await useFetch('/api/health')
const json = computed(() => JSON.stringify(data.value ?? {}, null, 2))
</script>
