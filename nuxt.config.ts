// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-security',
  ],

  ssr: true,

  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true,
    },
  },

  runtimeConfig: {
    // Private keys (server-only)
    clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',

    // Public keys (exposed to client)
    public: {
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      baseDomain: process.env.BASE_DOMAIN || 'localhost:3000',
      appDomain: process.env.APP_DOMAIN || 'localhost:3000',
      adminDomain: process.env.ADMIN_DOMAIN || 'app.localhost:3000',
    },
  },

  typescript: {
    strict: true,
    typeCheck: false, // Enable in CI/CD
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },

  css: [
    '@myissue/vue-website-page-builder/style.css',
  ],
})
