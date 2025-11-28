<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
    <h3 class="text-xl font-semibold mb-2">{{ project.name }}</h3>
    <p class="text-sm text-gray-500 mb-4">{{ project.industryType }}</p>

    <div class="mb-4">
      <span class="text-sm text-gray-600">
        {{ project.subdomain }}.{{ baseDomain }}
      </span>
    </div>

    <div class="flex gap-2">
      <NuxtLink
        :to="`/admin/projects/${project.id}`"
        class="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Edit
      </NuxtLink>
      <a
        :href="`http://${project.subdomain}.${baseDomain}`"
        target="_blank"
        class="flex-1 text-center border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition"
      >
        View
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: string
  name: string
  industryType: string
  subdomain: string
}

defineProps<{
  project: Project
  baseDomain: string
}>()
</script>
