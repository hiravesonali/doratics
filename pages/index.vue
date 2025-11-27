<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          Handymen Website Builder
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Create beautiful websites for your handyman business in minutes
        </p>
        <a
          href="http://app.localhost:3000/admin"
          class="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          Go to Admin Dashboard →
        </a>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mt-12">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-3xl mb-3">🎨</div>
          <h3 class="text-lg font-semibold mb-2">Beautiful Templates</h3>
          <p class="text-gray-600">Pre-built themes designed for handymen and local services</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-3xl mb-3">⚡</div>
          <h3 class="text-lg font-semibold mb-2">Fast & SEO Ready</h3>
          <p class="text-gray-600">Optimized for search engines and fast loading</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-3xl mb-3">🔧</div>
          <h3 class="text-lg font-semibold mb-2">No Coding Required</h3>
          <p class="text-gray-600">Visual page builder with drag-and-drop</p>
        </div>
      </div>

      <div class="mt-12 text-center text-gray-500">
        <p>Visit <strong>app.localhost:3000</strong> to access the admin dashboard</p>
      </div>
    </div>
  </div>
</template>
