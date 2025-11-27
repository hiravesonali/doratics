<template>
  <section class="py-16 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ block.heading || 'Contact Us' }}
        </h2>
        <p v-if="block.subheading" class="text-lg text-gray-600">
          {{ block.subheading }}
        </p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            v-model="formData.message"
            rows="4"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ isSubmitting ? 'Sending...' : 'Send Message' }}
        </button>

        <p v-if="submitMessage" :class="submitSuccess ? 'text-green-600' : 'text-red-600'" class="text-center">
          {{ submitMessage }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  block: any
}>()

const formData = ref({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)

async function submitForm() {
  isSubmitting.value = true
  submitMessage.value = ''

  try {
    // In production, send to API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000))

    submitSuccess.value = true
    submitMessage.value = 'Thank you! Your message has been sent.'

    // Reset form
    formData.value = {
      name: '',
      email: '',
      message: '',
    }
  } catch (error) {
    submitSuccess.value = false
    submitMessage.value = 'Sorry, there was an error. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
