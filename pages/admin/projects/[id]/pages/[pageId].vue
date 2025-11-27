<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div v-if="page" class="h-screen flex flex-col">
      <!-- Editor Header -->
      <div class="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="`/admin/projects/${projectId}`"
            class="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </NuxtLink>
          <div>
            <h1 class="text-lg font-semibold">{{ page.title }}</h1>
            <p class="text-sm text-gray-500">{{ page.slug }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="savePage"
            :disabled="saving"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button
            @click="publishPage"
            :disabled="publishing"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ publishing ? 'Publishing...' : 'Publish' }}
          </button>
        </div>
      </div>

      <!-- Page Builder -->
      <div class="flex-1 overflow-hidden">
        <ClientOnly>
          <VueWebsitePageBuilder
            v-model="pageLayout"
            @update:modelValue="onLayoutUpdate"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueWebsitePageBuilder } from '@myissue/vue-website-page-builder'

definePageMeta({
  layout: false,
})

const route = useRoute()
const projectId = route.params.id as string
const pageId = route.params.pageId as string

const saving = ref(false)
const publishing = ref(false)
const pageLayout = ref({})

// Fetch page data
const { data: pageData } = await useFetch(`/api/pages/${projectId}/${pageId}`, {
  headers: {
    Authorization: `Bearer demo-token`,
  },
})

const page = computed(() => pageData.value?.data)

// Initialize layout
if (page.value) {
  pageLayout.value = page.value.layoutJson || {}
}

function onLayoutUpdate(newLayout: any) {
  pageLayout.value = newLayout
}

async function savePage() {
  saving.value = true
  try {
    await $fetch(`/api/pages/${projectId}/${pageId}`, {
      method: 'PATCH',
      body: {
        layoutJson: pageLayout.value,
      },
      headers: {
        Authorization: `Bearer demo-token`,
      },
    })
    alert('Page saved!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to save page')
  } finally {
    saving.value = false
  }
}

async function publishPage() {
  publishing.value = true
  try {
    await $fetch(`/api/pages/${projectId}/${pageId}`, {
      method: 'PATCH',
      body: {
        layoutJson: pageLayout.value,
        status: 'published',
      },
      headers: {
        Authorization: `Bearer demo-token`,
      },
    })
    alert('Page published!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to publish page')
  } finally {
    publishing.value = false
  }
}
</script>
