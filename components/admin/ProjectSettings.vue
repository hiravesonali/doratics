<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Project Settings</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2">Project Name</label>
        <input
          v-model="formData.name"
          type="text"
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Custom Domain (Optional)</label>
        <input
          v-model="formData.customDomain"
          type="text"
          placeholder="www.yourdomain.com"
          class="w-full px-4 py-2 border rounded-lg"
        />
        <p class="text-sm text-gray-500 mt-1">
          Add a CNAME record pointing to {{ baseDomain }}
        </p>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Saving...' : 'Save Settings' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  settings: {
    name: string
    customDomain: string | null
  }
  baseDomain: string
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: { name: string; customDomain: string | null }]
}>()

const formData = ref({
  name: props.settings.name || '',
  customDomain: props.settings.customDomain || '',
})

// Watch for prop changes to update form data
watch(() => props.settings, (newSettings) => {
  formData.value = {
    name: newSettings.name || '',
    customDomain: newSettings.customDomain || '',
  }
}, { deep: true })

function handleSubmit() {
  emit('submit', { ...formData.value })
}
</script>
