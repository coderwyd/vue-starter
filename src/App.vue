<script setup lang="ts">
import { AppProvider } from '@/components/Application'
</script>

<template>
  <AppProvider>
    <RouterView #="{ Component, route }">
      <component :is="Component" :key="route.path" class="w-full h-full" />
    </RouterView>
  </AppProvider>
</template>
