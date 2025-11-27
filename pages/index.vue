<template>
  <!-- Show landing page only for main domain (localhost:3000 without subdomain) -->
  <div v-if="isMainDomain" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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

  <!-- For subdomains, show the project homepage -->
  <div v-else>
    <div v-if="page">
      <!-- SEO Meta Tags -->
      <Head>
        <Title>{{ page.seoTitle || page.title }}</Title>
        <Meta name="description" :content="page.seoDescription || ''" />
      </Head>

      <!-- Theme Header -->
      <PublicHeader v-if="headerTheme" :theme="headerTheme" />

      <!-- Page Content -->
      <PublicPageRenderer :layout="page.layoutJson" />

      <!-- Theme Footer -->
      <PublicFooter v-if="footerTheme" :theme="footerTheme" />
    </div>

    <div v-else class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p class="text-gray-600">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Check if this is the main domain (without subdomain)
const isMainDomain = computed(() => {
  if (typeof window !== 'undefined') {
    const host = window.location.host
    const hostWithoutPort = host.split(':')[0] || 'localhost'
    // Main domain is just "localhost" without any subdomain
    return hostWithoutPort === 'localhost' || !hostWithoutPort.includes('.')
  }
  return true
})

// Fetch page data for subdomains
const { data: pageData } = await useFetch('/api/public/page', {
  query: { slug: '/' },
  server: true,
  lazy: false,
  // Only fetch if not main domain
  immediate: !isMainDomain.value,
})

const page = computed(() => (pageData.value as any)?.data)
const headerTheme = computed(() => (pageData.value as any)?.headerTheme)
const footerTheme = computed(() => (pageData.value as any)?.footerTheme)
</script>
