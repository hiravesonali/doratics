<template>
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-700 mb-2 inline-block">
          ← Back to Projects
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">{{ project.name }}</h1>
        <p class="text-gray-600 mt-1">{{ project.subdomain }}.{{ baseDomain }}</p>
      </div>

      <div class="flex gap-2">
        <button
          @click="$emit('publish')"
          :disabled="publishing"
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {{ publishing ? 'Publishing...' : 'Publish' }}
        </button>
        <a
          :href="`http://${project.subdomain}.${baseDomain}`"
          target="_blank"
          class="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
        >
          Preview
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  name: string
  subdomain: string
}

defineProps<{
  project: Project
  baseDomain: string
  publishing?: boolean
}>()

defineEmits<{
  publish: []
}>()
</script>
