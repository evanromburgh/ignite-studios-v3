<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { faviconUrl } = useBranding()

useHead({
  link: [{ rel: 'icon', type: 'image/png', href: faviconUrl }],
})
</script>
