<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-2">Legal Information</h2>
    <p class="text-gray-600 mb-6">
      Required for Impressum and Privacy pages (German law compliance)
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2">Company Name *</label>
        <input
          v-model="formData.companyName"
          type="text"
          required
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Owner Name *</label>
        <input
          v-model="formData.ownerName"
          type="text"
          required
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Address *</label>
        <textarea
          v-model="formData.address"
          required
          rows="3"
          class="w-full px-4 py-2 border rounded-lg"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Email *</label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Phone *</label>
          <input
            v-model="formData.phone"
            type="tel"
            required
            class="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">VAT ID (Optional)</label>
        <input
          v-model="formData.vatId"
          type="text"
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Saving...' : 'Save Legal Info' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
interface LegalInfo {
  companyName: string
  ownerName: string
  address: string
  email: string
  phone: string
  vatId: string | null
}

const props = defineProps<{
  legalInfo: Partial<LegalInfo>
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: LegalInfo]
}>()

const formData = ref({
  companyName: props.legalInfo.companyName || '',
  ownerName: props.legalInfo.ownerName || '',
  address: props.legalInfo.address || '',
  email: props.legalInfo.email || '',
  phone: props.legalInfo.phone || '',
  vatId: props.legalInfo.vatId || '',
})

// Watch for prop changes to update form data
watch(() => props.legalInfo, (newInfo) => {
  formData.value = {
    companyName: newInfo.companyName || '',
    ownerName: newInfo.ownerName || '',
    address: newInfo.address || '',
    email: newInfo.email || '',
    phone: newInfo.phone || '',
    vatId: newInfo.vatId || '',
  }
}, { deep: true })

function handleSubmit() {
  emit('submit', { ...formData.value })
}
</script>
