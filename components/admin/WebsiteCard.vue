<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
    <h3 class="text-xl font-semibold mb-2">{{ website.name }}</h3>
    <p class="text-sm text-gray-500 mb-4">{{ website.industryType }}</p>

    <div class="mb-4">
      <span class="text-sm text-gray-600">
        {{ website.subdomain }}.{{ baseDomain }}
      </span>
    </div>

    <div class="flex gap-2">
      <NuxtLink
        :to="`/admin/websites/${website.id}`"
        class="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Edit
      </NuxtLink>
      <a
        :href="`http://${website.subdomain}.${baseDomain}`"
        target="_blank"
        class="flex-1 text-center border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition"
      >
        View
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Website {
  id: string
  name: string
  industryType: string
  subdomain: string
}

defineProps<{
  website: Website
  baseDomain: string
}>()
</script>
