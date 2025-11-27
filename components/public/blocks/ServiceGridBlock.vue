<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="block.heading" class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ block.heading }}
        </h2>
        <p v-if="block.subheading" class="text-xl text-gray-600">
          {{ block.subheading }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(service, index) in block.services"
          :key="index"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <div class="text-4xl mb-4">{{ service.icon || '🔧' }}</div>
          <h3 class="text-xl font-semibold mb-2">{{ service.title }}</h3>
          <p class="text-gray-600">{{ service.description }}</p>
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
