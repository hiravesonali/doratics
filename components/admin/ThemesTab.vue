<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Header & Footer Themes</h2>
    <p class="text-gray-600 mb-8">Choose or customize the header and footer for your entire site.</p>

    <div class="space-y-8">
      <!-- Header Section -->
      <div>
        <h3 class="text-lg font-medium mb-4">Site Header</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Select Header Template</label>
            <select
              v-model="selectedHeaderId"
              class="w-full px-4 py-2 border rounded-lg"
              @change="handleHeaderChange"
            >
              <option :value="null">No Header</option>
              <option
                v-for="header in headerThemes"
                :key="header.id"
                :value="header.id"
              >
                {{ header.name }}
              </option>
            </select>
          </div>

          <div v-if="selectedHeaderId" class="border rounded-lg p-4 bg-gray-50">
            <p class="text-sm text-gray-600 mb-3">Preview:</p>
            <div class="bg-white border rounded overflow-hidden" v-html="getThemePreview(selectedHeaderId)"></div>
          </div>

          <div v-if="selectedHeaderId" class="space-y-2">
            <button
              @click="customizeHeader"
              :disabled="customizing"
              class="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {{ customizing ? '→ Preparing...' : '→ Customize Header in Page Builder' }}
            </button>
            <p class="text-xs text-gray-500">
              Note: Customizing will create a copy specific to your project
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div class="pt-6 border-t">
        <h3 class="text-lg font-medium mb-4">Site Footer</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Select Footer Template</label>
            <select
              v-model="selectedFooterId"
              class="w-full px-4 py-2 border rounded-lg"
              @change="handleFooterChange"
            >
              <option :value="null">No Footer</option>
              <option
                v-for="footer in footerThemes"
                :key="footer.id"
                :value="footer.id"
              >
                {{ footer.name }}
              </option>
            </select>
          </div>

          <div v-if="selectedFooterId" class="border rounded-lg p-4 bg-gray-50">
            <p class="text-sm text-gray-600 mb-3">Preview:</p>
            <div class="bg-white border rounded overflow-hidden" v-html="getThemePreview(selectedFooterId)"></div>
          </div>

          <div v-if="selectedFooterId" class="space-y-2">
            <button
              @click="customizeFooter"
              :disabled="customizing"
              class="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {{ customizing ? '→ Preparing...' : '→ Customize Footer in Page Builder' }}
            </button>
            <p class="text-xs text-gray-500">
              Note: Customizing will create a copy specific to your project
            </p>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="pt-6 border-t">
        <button
          @click="saveThemes"
          :disabled="saving"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Save Theme Settings' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Theme {
  id: string
  name: string
  type: string
  layoutJson: Record<string, unknown>
}

const props = defineProps<{
  projectId: string
  currentHeaderId: string | null
  currentFooterId: string | null
}>()

const emit = defineEmits<{
  saved: []
}>()

const saving = ref(false)
const customizing = ref(false)
const selectedHeaderId = ref<string | null>(props.currentHeaderId)
const selectedFooterId = ref<string | null>(props.currentFooterId)

// Fetch all themes
const { data: themesData } = await useFetch<{ success: boolean; data: Theme[] }>('/api/themes', {
  headers: {
    Authorization: 'Bearer demo-token',
  },
})

const headerThemes = computed(() => themesData.value?.data.filter(t => t.type === 'header') || [])
const footerThemes = computed(() => themesData.value?.data.filter(t => t.type === 'footer') || [])

function getThemePreview(themeId: string): string {
  const theme = themesData.value?.data.find(t => t.id === themeId)
  if (!theme) return ''

  const html = (theme.layoutJson as { html?: string })?.html || ''
  // Return a scaled down version for preview
  return `<div style="transform: scale(0.6); transform-origin: top left; width: 166%; height: 166%;">${html}</div>`
}

function handleHeaderChange() {
  // Optional: Auto-save on change
}

function handleFooterChange() {
  // Optional: Auto-save on change
}

async function customizeHeader() {
  if (!selectedHeaderId.value) return

  customizing.value = true
  try {
    // Check if current theme is already a custom theme (contains "Custom" in name)
    const currentTheme = themesData.value?.data.find(t => t.id === selectedHeaderId.value)
    const isCustomTheme = currentTheme?.name.includes('(Custom)')

    let themeIdToEdit = selectedHeaderId.value

    // If it's a template (not custom), clone it first
    if (!isCustomTheme) {
      const cloneResponse = await $fetch<{ success: boolean; data: Theme }>(`/api/themes/${selectedHeaderId.value}/clone`, {
        method: 'POST',
        headers: { Authorization: 'Bearer demo-token' },
      })

      themeIdToEdit = cloneResponse.data.id

      // Update project to use the cloned theme
      await $fetch(`/api/projects/${props.projectId}/themes`, {
        method: 'PATCH',
        body: { themeHeaderId: themeIdToEdit },
        headers: { Authorization: 'Bearer demo-token' },
      })

      selectedHeaderId.value = themeIdToEdit
      emit('saved')
    }

    // Navigate to editor
    await navigateTo(`/admin/projects/${props.projectId}/themes/header`)
  } catch (error) {
    console.error('Failed to prepare header for customization:', error)
    alert('Failed to prepare header for editing')
  } finally {
    customizing.value = false
  }
}

async function customizeFooter() {
  if (!selectedFooterId.value) return

  customizing.value = true
  try {
    // Check if current theme is already a custom theme (contains "Custom" in name)
    const currentTheme = themesData.value?.data.find(t => t.id === selectedFooterId.value)
    const isCustomTheme = currentTheme?.name.includes('(Custom)')

    let themeIdToEdit = selectedFooterId.value

    // If it's a template (not custom), clone it first
    if (!isCustomTheme) {
      const cloneResponse = await $fetch<{ success: boolean; data: Theme }>(`/api/themes/${selectedFooterId.value}/clone`, {
        method: 'POST',
        headers: { Authorization: 'Bearer demo-token' },
      })

      themeIdToEdit = cloneResponse.data.id

      // Update project to use the cloned theme
      await $fetch(`/api/projects/${props.projectId}/themes`, {
        method: 'PATCH',
        body: { themeFooterId: themeIdToEdit },
        headers: { Authorization: 'Bearer demo-token' },
      })

      selectedFooterId.value = themeIdToEdit
      emit('saved')
    }

    // Navigate to editor
    router.push(`/admin/projects/${props.projectId}/themes/footer`)
  } catch (error) {
    console.error('Failed to prepare footer for customization:', error)
    alert('Failed to prepare footer for editing')
  } finally {
    customizing.value = false
  }
}

async function saveThemes() {
  saving.value = true
  try {
    await $fetch(`/api/projects/${props.projectId}/themes`, {
      method: 'PATCH',
      body: {
        themeHeaderId: selectedHeaderId.value,
        themeFooterId: selectedFooterId.value,
      },
      headers: {
        Authorization: 'Bearer demo-token',
      },
    })

    emit('saved')
    alert('Theme settings saved successfully!')
  } catch (error) {
    console.error('Failed to save themes:', error)
    alert('Failed to save theme settings')
  } finally {
    saving.value = false
  }
}
</script>
