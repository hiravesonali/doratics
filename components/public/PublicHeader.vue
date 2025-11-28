<template>
  <div v-if="themeHtml" v-html="themeHtml"></div>
  <header v-else class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-gray-900">Logo</span>
          </div>
        </div>
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="text-gray-700 hover:text-gray-900">Home</NuxtLink>
          <NuxtLink to="/services" class="text-gray-700 hover:text-gray-900">Services</NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900">About</NuxtLink>
          <NuxtLink to="/contact" class="text-gray-700 hover:text-gray-900">Contact</NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  theme: any
}>()

const themeHtml = computed(() => {
  return props.theme?.layoutJson?.html || ''
})
</script>
