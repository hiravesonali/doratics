<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">About Us</h3>
          <p class="text-gray-400">
            {{ theme?.layoutJson?.aboutText || 'Professional services for your needs.' }}
          </p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-white">Home</NuxtLink></li>
            <li><NuxtLink to="/services" class="text-gray-400 hover:text-white">Services</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-400 hover:text-white">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">Contact</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Legal</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/impressum" class="text-gray-400 hover:text-white">Impressum</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-white">Datenschutz</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  theme: any
}>()
</script>
