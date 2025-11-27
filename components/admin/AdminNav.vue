<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/admin" class="text-xl font-bold text-blue-600">
            Handymen Builder
          </NuxtLink>
        </div>

        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/admin"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Projects
          </NuxtLink>

          <button
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Account
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
