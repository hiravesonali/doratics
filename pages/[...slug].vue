<template>
  <div v-if="page && !isAdmin">
    <!-- SEO Meta Tags -->
    <Head>
      <Title>{{ page.seoTitle || page.title }}</Title>
      <Meta name="description" :content="page.seoDescription || ''" />
      <Meta property="og:title" :content="page.seoTitle || page.title" />
      <Meta property="og:description" :content="page.seoDescription || ''" />
      <Meta property="og:type" content="website" />
      <Link rel="canonical" :href="canonicalUrl" />
    </Head>

    <!-- Theme Header -->
    <PublicHeader v-if="headerTheme" :theme="headerTheme" />

    <!-- Page Content -->
    <PublicPageRenderer :layout="page.layoutJson" />

    <!-- Theme Footer -->
    <PublicFooter v-if="footerTheme" :theme="footerTheme" />
  </div>

  <div v-else-if="!page && !isAdmin" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p class="text-gray-600">The page you're looking for doesn't exist.</p>
    </div>
  </div>

  <!-- Admin routes are handled separately -->
  <NuxtPage v-else-if="isAdmin" />
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

// Get slug from route params
const slug = computed(() => {
  const pathArray = Array.isArray(route.params.slug) ? route.params.slug : [route.params.slug]
  return pathArray.join('/') || '/'
})

// Determine if this is admin mode
const isAdmin = computed(() => {
  const host = typeof window !== 'undefined' ? window.location.host : ''
  return host.includes('app.')
})

// Fetch page data for public sites
const { data: pageData } = await useFetch(`/api/public/page`, {
  query: {
    slug: slug.value,
  },
  server: true,
  lazy: false,
})

const page = computed(() => pageData.value?.data)
const headerTheme = computed(() => pageData.value?.headerTheme)
const footerTheme = computed(() => pageData.value?.footerTheme)

// Canonical URL
const canonicalUrl = computed(() => {
  const host = typeof window !== 'undefined' ? window.location.host : config.public.appDomain
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  return `${protocol}//${host}/${slug.value}`
})
</script>
