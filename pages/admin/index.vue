<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Projects</h1>
        <p class="text-gray-600 mt-2">Create and manage your website projects</p>
      </div>

      <!-- Create New Project Button -->
      <div class="mb-8">
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Create New Project
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-if="projects && projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          :base-domain="config.public.baseDomain"
        />
      </div>

      <div v-else-if="!loading" class="text-center py-12 bg-white rounded-lg shadow">
        <p class="text-gray-500 mb-4">You haven't created any projects yet.</p>
        <button
          @click="showCreateModal = true"
          class="text-blue-600 font-semibold hover:text-blue-700"
        >
          Create your first project
        </button>
      </div>

      <!-- Create Project Modal -->
      <AdminCreateProjectModal
        v-model="showCreateModal"
        :base-domain="config.public.baseDomain"
        :loading="creating"
        :error="createError"
        @submit="createProject"
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

// Fetch projects
const { data: projectsData, refresh } = await useFetch('/api/projects', {
  headers: {
    Authorization: `Bearer demo-token`, // Replace with actual Clerk token
  },
})

const projects = computed(() => projectsData.value?.data || [])

async function createProject(formData: { name: string; industryType: string; subdomain: string }) {
  creating.value = true
  createError.value = ''
  try {
    await $fetch('/api/projects', {
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
      createError.value = 'Failed to create project. Please check your input and try again.'
    }
  } finally {
    creating.value = false
  }
}
</script>
