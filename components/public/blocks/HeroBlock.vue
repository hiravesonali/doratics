<template>
  <section class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          {{ block.heading || 'Welcome' }}
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          {{ block.subheading || 'Professional services you can trust' }}
        </p>
        <div v-if="block.ctaText" class="flex justify-center gap-4">
          <a
            :href="block.ctaLink || '#contact'"
            class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            {{ block.ctaText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  block: any
}>()
</script>
