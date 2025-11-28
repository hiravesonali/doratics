<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <h2 class="text-2xl font-bold mb-4">Create New Website</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Error Message Display -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p class="font-semibold">{{ error }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Website Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="My Handyman Business"
          />
          <p class="text-xs text-gray-500 mt-1">1-100 characters</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Industry Type</label>
          <select
            v-model="formData.industryType"
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
              v-model="formData.subdomain"
              type="text"
              required
              pattern="[a-z0-9-]+"
              class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="my-business"
            />
            <span class="text-gray-500">.{{ baseDomain }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">3-50 characters, lowercase letters, numbers, and hyphens only</p>
        </div>

        <div class="flex gap-2 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Website' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  baseDomain: string
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: { name: string; industryType: string; subdomain: string }]
}>()

const formData = ref({
  name: '',
  industryType: 'other',
  subdomain: '',
})

function closeModal() {
  emit('update:modelValue', false)
  // Reset form on close
  formData.value = {
    name: '',
    industryType: 'other',
    subdomain: '',
  }
}

function handleSubmit() {
  emit('submit', { ...formData.value })
}

// Watch for modal close to reset form
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    formData.value = {
      name: '',
      industryType: 'other',
      subdomain: '',
    }
  }
})
</script>
