<template>
  <main class="min-h-dvh bg-zinc-950 p-8 font-mono text-sm text-zinc-100">
    <h1 class="mb-4 text-xl font-semibold">Supabase connectivity</h1>
    <p v-if="pending" class="text-zinc-400">Loading…</p>
    <pre v-else class="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs">{{ json }}</pre>
    <NuxtLink class="mt-6 inline-block text-emerald-400 underline" to="/">← Home</NuxtLink>
  </main>
</template>

<script setup lang="ts">
const { data, pending } = await useFetch('/api/health')
const json = computed(() => JSON.stringify(data.value ?? {}, null, 2))
</script>
