<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div v-if="website" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Website Header -->
      <AdminWebsiteHeader
        :website="website"
        :base-domain="config.public.baseDomain"
        :publishing="publishing"
        @publish="publishWebsite"
      />

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
            @click="activeTab = 'themes'"
            :class="[
              activeTab === 'themes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Themes
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
      <AdminPagesList
        v-if="activeTab === 'pages'"
        :pages="pages"
        :website-id="websiteId"
        @create-page="showCreatePageModal = true"
      />

      <!-- Settings Tab -->
      <AdminWebsiteSettings
        v-if="activeTab === 'settings'"
        :settings="settings"
        :base-domain="config.public.baseDomain"
        :loading="savingSettings"
        @submit="updateSettings"
      />

      <!-- Themes Tab -->
      <AdminThemesTab
        v-if="activeTab === 'themes'"
        :website-id="websiteId"
        :current-header-id="website.themeHeaderId"
        :current-footer-id="website.themeFooterId"
        @saved="handleThemesSaved"
      />

      <!-- Legal Info Tab -->
      <AdminLegalInfoForm
        v-if="activeTab === 'legal'"
        :legal-info="legalInfo"
        :loading="savingLegal"
        @submit="updateLegalInfo"
      />
    </div>

    <!-- Create Page Modal -->
    <AdminCreatePageModal
      v-model="showCreatePageModal"
      :loading="creatingPage"
      :error="pageCreateError"
      @submit="createPage"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const config = useRuntimeConfig()
const route = useRoute()
const websiteId = route.params.id as string

const activeTab = ref('pages')
const publishing = ref(false)
const savingSettings = ref(false)
const savingLegal = ref(false)
const showCreatePageModal = ref(false)
const creatingPage = ref(false)
const pageCreateError = ref('')

// Fetch website data
const { data: websiteData } = await useFetch(`/api/websites/${websiteId}`, {
  headers: {
    Authorization: 'Bearer demo-token',
  },
})

const website = computed(() => websiteData.value?.data)

// Fetch pages
const { data: pagesData, refresh: refreshPages } = await useFetch(
  `/api/pages/${websiteId}`,
  {
    headers: {
      Authorization: 'Bearer demo-token',
    },
  }
)

const pages = computed(() => pagesData.value?.data || [])

// Fetch legal info
const { data: legalData } = await useFetch(`/api/legal`, {
  headers: {
    Authorization: 'Bearer demo-token',
  },
})

const settings = ref({
  name: website.value?.name || '',
  customDomain: website.value?.customDomain || '',
})

const legalInfo = ref({
  companyName: legalData.value?.data?.companyName || '',
  ownerName: legalData.value?.data?.ownerName || '',
  address: legalData.value?.data?.address || '',
  email: legalData.value?.data?.email || '',
  phone: legalData.value?.data?.phone || '',
  vatId: legalData.value?.data?.vatId || '',
})

async function publishWebsite() {
  publishing.value = true
  try {
    await $fetch(`/api/websites/${websiteId}`, {
      method: 'PATCH',
      body: { published: true },
      headers: {
        Authorization: 'Bearer demo-token',
      },
    })
    alert('Website published successfully!')
  } catch (error) {
    const err = error as { data?: { message?: string } }
    alert(err.data?.message || 'Failed to publish website')
  } finally {
    publishing.value = false
  }
}

async function updateSettings(formData: { name: string; customDomain: string | null }) {
  savingSettings.value = true
  try {
    await $fetch(`/api/websites/${websiteId}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: 'Bearer demo-token',
      },
    })
    alert('Settings saved!')
  } catch (error) {
    const err = error as { data?: { message?: string } }
    alert(err.data?.message || 'Failed to save settings')
  } finally {
    savingSettings.value = false
  }
}

async function updateLegalInfo(formData: {
  companyName: string
  ownerName: string
  address: string
  email: string
  phone: string
  vatId: string | null
}) {
  savingLegal.value = true
  try {
    await $fetch('/api/legal', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer demo-token',
      },
    })
    alert('Legal information saved!')
  } catch (error) {
    const err = error as { data?: { message?: string } }
    alert(err.data?.message || 'Failed to save legal information')
  } finally {
    savingLegal.value = false
  }
}

async function createPage(formData: { title: string; slug: string }) {
  creatingPage.value = true
  pageCreateError.value = ''
  try {
    await $fetch(`/api/pages/${websiteId}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer demo-token',
      },
    })
    showCreatePageModal.value = false
    await refreshPages()
  } catch (error) {
    const err = error as { data?: { message?: string; statusMessage?: string } }
    // Display validation errors properly
    if (err.data?.message) {
      pageCreateError.value = err.data.message
    } else if (err.data?.statusMessage) {
      pageCreateError.value = err.data.statusMessage
    } else {
      pageCreateError.value = 'Failed to create page. Please check your input and try again.'
    }
  } finally {
    creatingPage.value = false
  }
}

function handleThemesSaved() {
  // Refresh website data to get updated theme IDs
  // The ThemesTab component handles its own state
}
</script>
