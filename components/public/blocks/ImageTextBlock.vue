<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        :class="{ 'md:flex-row-reverse': block.imagePosition === 'right' }"
      >
        <div>
          <img
            :src="block.imageUrl || 'https://via.placeholder.com/600x400'"
            :alt="block.imageAlt || 'Image'"
            class="rounded-lg shadow-lg w-full"
          />
        </div>
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ block.heading }}
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            {{ block.text }}
          </p>
          <a
            v-if="block.ctaText"
            :href="block.ctaLink || '#'"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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
