<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div v-if="project" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Project Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Projects
            </NuxtLink>
            <h1 class="text-3xl font-bold text-gray-900">{{ project.name }}</h1>
            <p class="text-gray-600 mt-1">{{ project.subdomain }}.yourapp.com</p>
          </div>

          <div class="flex gap-2">
            <button
              @click="publishProject"
              :disabled="publishing"
              class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {{ publishing ? 'Publishing...' : 'Publish' }}
            </button>
            <a
              :href="`https://${project.subdomain}.yourapp.com`"
              target="_blank"
              class="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Preview
            </a>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'pages'"
            :class="[
              activeTab === 'pages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Pages
          </button>
          <button
            @click="activeTab = 'settings'"
            :class="[
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Settings
          </button>
          <button
            @click="activeTab = 'legal'"
            :class="[
              activeTab === 'legal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Legal Info
          </button>
        </nav>
      </div>

      <!-- Pages Tab -->
      <div v-if="activeTab === 'pages'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pages</h2>
          <button
            @click="showCreatePageModal = true"
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
                :to="`/admin/projects/${project.id}/pages/${page.id}`"
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

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-6">Project Settings</h2>

        <form @submit.prevent="updateSettings" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Project Name</label>
            <input
              v-model="settings.name"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Custom Domain (Optional)</label>
            <input
              v-model="settings.customDomain"
              type="text"
              placeholder="www.yourdomain.com"
              class="w-full px-4 py-2 border rounded-lg"
            />
            <p class="text-sm text-gray-500 mt-1">
              Add a CNAME record pointing to yourapp.com
            </p>
          </div>

          <button
            type="submit"
            :disabled="savingSettings"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ savingSettings ? 'Saving...' : 'Save Settings' }}
          </button>
        </form>
      </div>

      <!-- Legal Info Tab -->
      <div v-if="activeTab === 'legal'" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-2">Legal Information</h2>
        <p class="text-gray-600 mb-6">
          Required for Impressum and Privacy pages (German law compliance)
        </p>

        <form @submit.prevent="updateLegalInfo" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Company Name *</label>
            <input
              v-model="legalInfo.companyName"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Owner Name *</label>
            <input
              v-model="legalInfo.ownerName"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Address *</label>
            <textarea
              v-model="legalInfo.address"
              required
              rows="3"
              class="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Email *</label>
              <input
                v-model="legalInfo.email"
                type="email"
                required
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Phone *</label>
              <input
                v-model="legalInfo.phone"
                type="tel"
                required
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">VAT ID (Optional)</label>
            <input
              v-model="legalInfo.vatId"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            :disabled="savingLegal"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ savingLegal ? 'Saving...' : 'Save Legal Info' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const projectId = route.params.id as string

const activeTab = ref('pages')
const publishing = ref(false)
const savingSettings = ref(false)
const savingLegal = ref(false)
const showCreatePageModal = ref(false)

// Fetch project data
const { data: projectData } = await useFetch(`/api/projects/${projectId}`, {
  headers: {
    Authorization: `Bearer demo-token`,
  },
})

const project = computed(() => projectData.value?.data)

// Fetch pages
const { data: pagesData, refresh: refreshPages } = await useFetch(
  `/api/pages/${projectId}`,
  {
    headers: {
      Authorization: `Bearer demo-token`,
    },
  }
)

const pages = computed(() => pagesData.value?.data || [])

// Fetch legal info
const { data: legalData } = await useFetch(`/api/legal/${projectId}`, {
  headers: {
    Authorization: `Bearer demo-token`,
  },
})

const settings = ref({
  name: project.value?.name || '',
  customDomain: project.value?.customDomain || '',
})

const legalInfo = ref({
  companyName: legalData.value?.data?.companyName || '',
  ownerName: legalData.value?.data?.ownerName || '',
  address: legalData.value?.data?.address || '',
  email: legalData.value?.data?.email || '',
  phone: legalData.value?.data?.phone || '',
  vatId: legalData.value?.data?.vatId || '',
})

async function publishProject() {
  publishing.value = true
  try {
    await $fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      body: { published: true },
      headers: {
        Authorization: `Bearer demo-token`,
      },
    })
    alert('Project published successfully!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to publish project')
  } finally {
    publishing.value = false
  }
}

async function updateSettings() {
  savingSettings.value = true
  try {
    await $fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      body: settings.value,
      headers: {
        Authorization: `Bearer demo-token`,
      },
    })
    alert('Settings saved!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to save settings')
  } finally {
    savingSettings.value = false
  }
}

async function updateLegalInfo() {
  savingLegal.value = true
  try {
    await $fetch(`/api/legal/${projectId}`, {
      method: 'POST',
      body: legalInfo.value,
      headers: {
        Authorization: `Bearer demo-token`,
      },
    })
    alert('Legal information saved!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to save legal information')
  } finally {
    savingLegal.value = false
  }
}
</script>
