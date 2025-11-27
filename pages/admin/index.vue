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
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
        >
          <h3 class="text-xl font-semibold mb-2">{{ project.name }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ project.industryType }}</p>

          <div class="mb-4">
            <span class="text-sm text-gray-600">
              {{ project.subdomain }}.yourapp.com
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
              :href="`https://${project.subdomain}.yourapp.com`"
              target="_blank"
              class="flex-1 text-center border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition"
            >
              View
            </a>
          </div>
        </div>
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

      <!-- Create Project Modal (simplified for MVP) -->
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showCreateModal = false"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h2 class="text-2xl font-bold mb-4">Create New Project</h2>

          <form @submit.prevent="createProject" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Project Name</label>
              <input
                v-model="newProject.name"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="My Handyman Business"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Industry Type</label>
              <select
                v-model="newProject.industryType"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="cleaner">Cleaner</option>
                <option value="painter">Painter</option>
                <option value="gardener">Gardener</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Subdomain</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="newProject.subdomain"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="my-business"
                />
                <span class="text-gray-500">.yourapp.com</span>
              </div>
            </div>

            <div class="flex gap-2 pt-4">
              <button
                type="submit"
                :disabled="creating"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {{ creating ? 'Creating...' : 'Create Project' }}
              </button>
              <button
                type="button"
                @click="showCreateModal = false"
                class="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const showCreateModal = ref(false)
const loading = ref(false)
const creating = ref(false)

const newProject = ref({
  name: '',
  industryType: 'other',
  subdomain: '',
})

// Fetch projects
const { data: projectsData, refresh } = await useFetch('/api/projects', {
  headers: {
    Authorization: `Bearer demo-token`, // Replace with actual Clerk token
  },
})

const projects = computed(() => projectsData.value?.data || [])

async function createProject() {
  creating.value = true
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      body: newProject.value,
      headers: {
        Authorization: `Bearer demo-token`, // Replace with actual Clerk token
      },
    })

    showCreateModal.value = false
    newProject.value = {
      name: '',
      industryType: 'other',
      subdomain: '',
    }

    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create project')
  } finally {
    creating.value = false
  }
}
</script>
