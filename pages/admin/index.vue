<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Websites</h1>
        <p class="text-gray-600 mt-2">Create and manage your websites</p>
      </div>

      <!-- Create New Website Button -->
      <div class="mb-8">
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Create New Website
        </button>
      </div>

      <!-- Websites Grid -->
      <div v-if="websites && websites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminWebsiteCard
          v-for="website in websites"
          :key="website.id"
          :website="website"
          :base-domain="config.public.baseDomain"
        />
      </div>

      <div v-else-if="!loading" class="text-center py-12 bg-white rounded-lg shadow">
        <p class="text-gray-500 mb-4">You haven't created any websites yet.</p>
        <button
          @click="showCreateModal = true"
          class="text-blue-600 font-semibold hover:text-blue-700"
        >
          Create your first website
        </button>
      </div>

      <!-- Create Website Modal -->
      <AdminCreateWebsiteModal
        v-model="showCreateModal"
        :base-domain="config.public.baseDomain"
        :loading="creating"
        :error="createError"
        @submit="createWebsite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const config = useRuntimeConfig()
const showCreateModal = ref(false)
const loading = ref(false)
const creating = ref(false)
const createError = ref('')

// Fetch websites
const { data: websitesData, refresh } = await useFetch('/api/websites', {
  headers: {
    Authorization: `Bearer demo-token`, // Replace with actual Clerk token
  },
})

const websites = computed(() => websitesData.value?.data || [])

async function createWebsite(formData: { name: string; industryType: string; subdomain: string }) {
  creating.value = true
  createError.value = ''
  try {
    await $fetch('/api/websites', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer demo-token`, // Replace with actual Clerk token
      },
    })

    showCreateModal.value = false
    await refresh()
  } catch (error: any) {
    // Display validation errors properly
    if (error.data?.message) {
      createError.value = error.data.message
    } else if (error.data?.statusMessage) {
      createError.value = error.data.statusMessage
    } else {
      createError.value = 'Failed to create website. Please check your input and try again.'
    }
  } finally {
    creating.value = false
  }
}
</script>
