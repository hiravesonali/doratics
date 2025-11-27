<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ block.heading || 'What Our Clients Say' }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(testimonial, index) in block.testimonials"
          :key="index"
          class="bg-white p-6 rounded-lg shadow-md"
        >
          <div class="flex items-center mb-4">
            <div class="text-yellow-400">★★★★★</div>
          </div>
          <p class="text-gray-600 mb-4">{{ testimonial.text }}</p>
          <div class="font-semibold text-gray-900">{{ testimonial.author }}</div>
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
