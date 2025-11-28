<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-xl font-semibold mb-4">Create New Page</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Error Message Display -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p class="font-semibold">{{ error }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Page Title *</label>
          <input
            v-model="formData.title"
            type="text"
            required
            placeholder="e.g., Home, About Us, Services"
            class="w-full px-4 py-2 border rounded-lg"
          />
          <p class="text-xs text-gray-500 mt-1">1-200 characters</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">URL Slug *</label>
          <input
            v-model="formData.slug"
            type="text"
            required
            placeholder="e.g., /home, /about-us, /services"
            class="w-full px-4 py-2 border rounded-lg"
          />
          <p class="text-xs text-gray-500 mt-1">Auto-sanitizes: converts to lowercase, replaces spaces with hyphens. Use '/' for homepage.</p>
        </div>

        <div class="flex gap-2 justify-end">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Page' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: { title: string; slug: string }]
}>()

const formData = ref({
  title: '',
  slug: '',
})

function closeModal() {
  emit('update:modelValue', false)
  // Reset form on close
  formData.value = {
    title: '',
    slug: '',
  }
}

function handleSubmit() {
  emit('submit', { ...formData.value })
}

// Watch for modal close to reset form
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    formData.value = {
      title: '',
      slug: '',
    }
  }
})
</script>
