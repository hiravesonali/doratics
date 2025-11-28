<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Pages</h2>
      <button
        @click="$emit('create-page')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Add Page
      </button>
    </div>

    <div v-if="pages && pages.length > 0" class="bg-white rounded-lg shadow divide-y">
      <div
        v-for="page in pages"
        :key="page.id"
        class="p-4 flex items-center justify-between hover:bg-gray-50"
      >
        <div>
          <h3 class="font-medium">{{ page.title }}</h3>
          <p class="text-sm text-gray-500">{{ page.slug }}</p>
          <span
            :class="[
              'inline-block px-2 py-1 text-xs rounded mt-1',
              page.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ page.status }}
          </span>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            :to="`/admin/websites/${websiteId}/pages/${page.id}`"
            class="text-blue-600 hover:text-blue-700 px-3 py-1"
          >
            Edit
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
      No pages yet. Create your first page to get started.
    </div>
  </div>
</template>

<script setup lang="ts">
interface Page {
  id: string
  title: string
  slug: string
  status: string
}

defineProps<{
  pages: Page[]
  websiteId: string
}>()

defineEmits<{
  'create-page': []
}>()
</script>
